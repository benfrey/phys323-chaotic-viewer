let appHolder;

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
            savGol: {
                windowSize: 1201,        // Sav-Gol filter size m, where m=2k+1 (type int) - in class we used sidepoints k=600
                derivative: 1,           // Degree of derivative, 0 is default, 1 is for first derivative (type int)
                polynomial: 4            // Order of the regression polynomial (type int) - in class we used 4th order poly
            }
        },
        data: {
            rawPosArray: null,  // This is our entire float array after being read from file. 
                                // We will want to use poArray for graphing because the SG filter will result in angVelArray
            posArray: null,     // This is our shortened float array after SG forms angPosArray
            angPosArray: null,  // Result from Sav-Gol filter
        },
        graph: {
            xData: null,        // X-axis data that will be displayed to plot
            yData: null         // Y-axis data that will be displayed to plot 
        }
    };

    // start animation loop
    //start_time = performance.now(); // current timestamp in milliseconds

    //window.requestAnimationFrame(animate);
}

// Inline function when upload is complete to read binary file
function fileChange() {
    const binFile = document.getElementById('bin_file').files[0];
    const txtFile = document.getElementById('bin_file').files[1];

    // Load the bin file and wait until complete
    loadBin(binFile);

    // Load the text file and wait until complete
    loadTxt(txtFile);

    // Process data through Sav-Gol filter
    appHolder.data.angPosArray = sgg(appHolder.data.rawPosArray, 1/appHolder.attributes.sampleFreq, savGol); // data input, deltaX value, sav-gol filter options

    // Determine if we are plotting phase or poincare section
    if (1 == 0) {
        graph.xData = [-1,5]; 
        graph.yData = [1,0];
    } else if (1 == 0) {
        graph.xData = [-1,5]; 
        graph.yData = [1,0]; // Need some way to do slicing with intervals on data to form a poincare section
    }

    // Update plot - do I actually need to do this?
    xData = null;
    yData = null;
} 

//https://github.com/tensorflow/tfjs/issues/386
function loadBin(binFile) {					
    /*
    Parameters: binFile - a binary file instance
    Return none
    */		    								          

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
  
        // Update the rawPosArray
        appHolder.data.rawPosArray = f64;
    };
    fr.readAsArrayBuffer(binFile); 
}

function loadTxt(txtFile) {
    //

    // Update appHolder arributes
    appHolder.attributes.txtFileContents = "empty stuff";
    appHolder.attributes.dataPoints = 896000;
    appHolder.attributes.sampleSize = 6400;
    appHolder.attributes.sampleFreq = 6400;
}