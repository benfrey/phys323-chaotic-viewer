// Built-in Node.js modules
let fs = require('fs');
let path = require('path');

// NPM modules
let express = require('express');
let sqlite3 = require('sqlite3');
const { response } = require('express');
const Chart = require('chart.js');

// Load in starting files
let public_dir = path.join(__dirname, 'public');
let template_dir = path.join(__dirname, 'templates');
//let db_filename = path.join(__dirname, 'db', 'usenergy.sqlite3');
let default_bin_file = path.join(__dirname, 'data', 'MJTestDataRun.bin');
let default_txt_file = path.join(__dirname, 'data', 'MJTestDataRun.txt');

// Setup express app
let app = express();
let port = 3000;

/*
// Open usenergy.sqlite3 database
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});
*/

/*
// Open txt file
let db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});
*/

/*
// Read bin file
//fileFilter(default_bin_file, fnLineFilter, fnComplete);

// Read in binary file as slices of size "BUFF_SIZE"
function fileFilter(file, fnLineFilter, fnComplete) {
    var bPos = 0,
        mx = file.size,
        BUFF_SIZE = 262144, // 4096
        i = 0,
        collection = [],
        lineCount = 0;
    var d1 = +new Date;
    var remainder = "";

    function grabNextChunk() {

        var myBlob = file.slice(BUFF_SIZE * i, (BUFF_SIZE * i) + BUFF_SIZE, file.type);
        i++;

        var fr = new FileReader();

        fr.onload = function(e) {

            //run line filter:
            var str = remainder + e.target.result,
                o = str,
                r = str.split(/\r?\n/);
            remainder = r.slice(-1)[0];
            r.pop();
            lineCount += r.length;

            var rez = r.map(fnLineFilter).filter(Boolean);
            if (rez.length) {
                [].push.apply(collection, rez);
            } // end if

            if ((BUFF_SIZE * i) > mx) {
                fnComplete(collection);
                console.log("filtered " + file.name + " in " + (+new Date() - d1) + "ms  ");
            } // end if((BUFF_SIZE * i) > mx) 
            else {
                setTimeout(grabNextChunk, 0);
            }

        };
        fr.readAsText(myBlob, myBlob.type);
    } // grab next chunck

    grabNextChunk();
} // end pf fileFilter()
*/

// Serve static files from 'public' directory
app.use(express.static(public_dir));

// GET request handler for '/'
app.get('/', (req, res) => {
    //console.log(req.params.selected_energy_source);

    fs.readFile(path.join(template_dir, 'viewer.html'), (err, template) => {
        // modify `template` and send response
        // this will require a query to the SQL database
        let response = template.toString();

        // Declare
        let xData;
        let yData;

        xData = [-3, -1, 0, 1, 2, 3];
        yData = [2, -4, 7, -3, -2, 8];

        let dataCount = 204800;
        let sampleSize = 6400;
        let sampleFreq = 12800;

        // stringifies to pass data later
        xData = JSON.stringify(xData);
        yData = JSON.stringify(yData);

        console.log(xData);
        console.log(yData);

        response = response.replace('{{{XDATA}}}', xData);
        response = response.replace('{{{YDATA}}}', yData);

        res.status(200).type('html').send(response);
    });
});

app.listen(port, () => {
    console.log('Now listening on port ' + port);
});

/*
// Transpose method from https://www.tutorialspoint.com/finding-transpose-of-a-2-d-array-javascript
const transpose = arr => {
  let res = [];
  res = arr.reduce((acc, val, ind) => {
    val.forEach((el, index) => {
        acc[index] = acc[index] || [];
        acc[index][ind] = el;
    });
    return acc;
  }, [])
  return res;
};
*/
