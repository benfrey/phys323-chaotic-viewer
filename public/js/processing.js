let appHolder;  // Holds attributes, data, and graph information
let start_time; // Holds time for animation features

function init() {
    let w = 800;
    let h = 600;
    let graphDiv = document.getElementById('graphDiv');
    graphDiv.width = w;
    graphDiv.height = h;

    // initial app variables
    appHolder = {
        attributes: {
            binFile: null,               // Bin file (type file)
            txtFile: null,               // Txt file (type file)
            txtFileContents: null,       // Initial txt file contents (type string)
            dataPoints: null,            // Initial total data point count from txt file (type int)
            sampleSize: null,            // Initial sample size from txt file (type int)
            sampleFreq: null,            // Initial sample frequency from txt file (type int)
            windowSize: 1201,            // Sav-Gol filter size m, where m=2k+1 (type int) - in class we used sidepoints k=600
            derivative: null,            // Degree of derivative, 0 is for smoothing, 1 is for first derivative (type int)
            polynomial: 4                // Order of the regression polynomial (type int) - in class we used 4th order poly
        },
        data: {
            rawPosArray: null,          // This is our entire float array after being read from file. 
                                        // We will want to use poArray for graphing because the SG filter will result in angVelArray
            posArray: null,             // This is our shortened float array after SG forms angPosArray
            angPosArray: null           // Result from Sav-Gol filter
        },
        graph: {
            xData: null,                // X-axis data that will be displayed to plot
            yData: null,                // Y-axis data that will be displayed to plot 
            viewType: 0                 // 0 for phase, 1 for poincare, 2 for animated poincare (step through theta)
        }
    };

    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds

    //window.requestAnimationFrame(animate); // enables animation of plot
}

function animate(timestamp) {
    // Do nothing
}

// Inline function when upload is complete to read binary file
async function uploadData() {
    console.log("New submission click...");
    
    // Update appHolder with selected attributes
    appHolder.attributes.windowSize = parseInt(Number(document.getElementById("side_points").value)*2+1);
    appHolder.attributes.polynomial = parseInt(Number(document.getElementById("poly_order").value));
    appHolder.graph.viewType = parseInt(document.getElementById("display_format").selectedIndex);

    // Iterate through the two uploaded files
    for (var i = 0; i < document.getElementById("upload_file").files.length; i++) {
        if (document.getElementById("upload_file").files[i].name.includes(".bin")) {
            appHolder.attributes.binFile = document.getElementById("upload_file").files[i];
        } else if (document.getElementById("upload_file").files[i].name.includes(".txt")) {
            appHolder.attributes.txtFile = document.getElementById("upload_file").files[i];
        }
    }

    // Load the text file and wait until complete
    loadTxt(appHolder.attributes.txtFile);

    // Load the bin file and wait until complete
    await loadBin(appHolder.attributes.binFile, (rawPosArray) => {
        new Promise((res, rej) => {
            // Bin loaded, now process data through SG smooth and derivative
            appHolder.data.rawPosArray = rawPosArray;
            let x = processData(rawPosArray, 0);
            x.forEach(function(element, index, array) {
                array[index] =  ((((element + Math.PI) % (2*Math.PI)) + (2*Math.PI)) % (2*Math.PI)) - Math.PI; // We want modulu, not remainder - Wrap from -pi to pi
            });
            appHolder.data.posArray = x;
            let y = processData(rawPosArray, 1);
            appHolder.data.angPosArray = y;
            res([x,y])
        }).then((result) => {
            // Data processed through SG, now populate graph arrays based on display type
            result = populateGraphArrays(result);
            appHolder.graph.xData = result[0];
            appHolder.graph.yData = result[1];
            return result;
        }).then((result) => {
            // Graph arrays populated, now Update the plotly graph
            result = updatePlot(result);
            return result;
        });
    });
} 

async function graphUpdate() {
    // Populate graph arrays
    await populateGraphArrays([appHolder.data.posArray, appHolder.data.angPosArray], (result) => {
        new Promise((res, rej) => {
            // Update plot
            let pResult = updatePlot(result);
            res(pResult);
        });
    });
}

function processData(inArray, inDerivative) {
    console.log("Applying SGG filter to array...");
    return sgg(inArray, 1/appHolder.attributes.sampleFreq, 
    {windowSize: appHolder.attributes.windowSize, derivative: inDerivative, polynomial: appHolder.attributes.polynomial}); // data input, deltaX value, sav-gol filter options
}

//https://github.com/tensorflow/tfjs/issues/386
function loadBin(binFile, callback) {					
    /*
    Parameters: binFile - a binary file instance
    Return none
    */		    	
   
    console.log("Loading binary file...");

    // More on the FileReader API by Mozilla: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    var fr = new FileReader();
    fr.onload = function () {
        var data = fr.result;       // ArrayBuffer type object is used to represent a generic, fixed-length raw binary data buffer.
        var dv = new DataView(data) // DataView view provides a low-level interface for reading and writing in a binary ArrayBuffer, 
                                    // without having to care about the platform's endianness.
        var f64 = new Float64Array(data.byteLength / 8); // Create a new Float64Array (double array) of size data.byteLength / 8
        const littleEndian = true;  // From our x86 LabVIEW platform, we are using little endian encording
      
        // Go through all elements from framebuffer
        for (let i = 0; i < f64.length; i++) {
            f64[i] = dv.getFloat64(i*8, littleEndian); // Read a double float with littleEndian encoding
        };   
  
        callback(f64);
    };
    fr.readAsArrayBuffer(binFile); 
}

// Load in the text file
function loadTxt(txtFile) {
    /*
    Parameters: txtFile - a txt file instance
    Return none
    */

    console.log("Loading text file...");

    var fr = new FileReader();
    fr.onload = function () {
        // Update appHolder arributes
        appHolder.attributes.txtFileContents = fr.result;
        let strings = fr.result.split('\n');
        appHolder.attributes.dataPoints = parseInt(Number(strings[3]));
        appHolder.attributes.sampleSize = parseInt(Number(strings[5]));
        appHolder.attributes.sampleFreq = parseInt(Number(strings[7]));
    };
    fr.readAsText(txtFile);
}

function populateGraphArrays(data) {
    console.log("Populating graph arrays...");
    
    // Remove filter edges
    data[0] = data[0].slice(parseInt(appHolder.attributes.windowSize/2), -parseInt(appHolder.attributes.windowSize/2));
    data[1] = data[1].slice(parseInt(appHolder.attributes.windowSize/2), -parseInt(appHolder.attributes.windowSize/2));
    
    // Determine if we are plotting phase or poincare section, update graph data
    if (appHolder.graph.viewType == 0) {
        return [data[0], data[1]];
    } else if (appHolder.graph.viewType == 1) {
        // Index original data array to develop poincare section
        let ratio = appHolder.attributes.sampleSize;
        let x = data[0].filter(function (value, index, ar) {
            return (index % ratio == 0);
        });
        let y = data[1].filter(function (value, index, ar) {
            return (index % ratio == 0);
        });

        return [x, y];
    } else if (appHolder.graph.viewType == 2) {
        // Using real world time as our offset, we are going to provide a new poincare section 
    
        // Index original data array to develop poincare section
        let ratio = appHolder.attributes.sampleSize;
        let x = data[0].filter(function (value, index, ar) {
            return (index+offset % ratio == 0);
        });
        let y = data[1].filter(function (value, index, ar) {
            return (index+offset % ratio == 0);
        });
    }
}

async function updatePlot(inputGraph) {
    console.log("Updating plot...");

    var graphDiv = document.getElementById('graphDiv')

    console.log(appHolder.graph.viewType);
    //console.log(inputGraph[1]);

    let customMode = function() {
        if (appHolder.graph.viewType == 0) {
            return 'lines';
        } else {
            return 'markers';
        }
    }; 

    var data = [{
      x: inputGraph[0],
      y: inputGraph[1],
      type: 'scatter',
      mode: 'markers'
    }];

    console.log(customMode);
    
    Plotly.newPlot(graphDiv, data);
    return 1;
}