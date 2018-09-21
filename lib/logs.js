/* File Description:
 *
 * Library for storing and rotating logs
 * 
 ******************************************************************************/

/*  Dependencies section:
    ---------------------   */
    const fs = require('fs');
    const path = require('path');
    const zlib = require('zlib');
/*  ---------------------------------------------------------- end of section */

/*  Main section:
    -------------   */

    // create a container for the logs library
    let lib = {};

    // setup the base directory for the data folder
    lib.baseDir = path.join(__dirname + "/../.logs");

    /*  
        method:     append a string to a file, create the file if it does not exist
        inputs:     file: name of file to append to or create;
                    str: the string to append to the file.
    */
    lib.append = (file, str, callback) => {
        fs.open(lib.baseDir.concat(file).concat('.log'), 'a', (err, fileDescriptor) => {
            if (!err && fileDescriptor){
                fs.appendFile(fileDescriptor, str.concat('\n'), (err) => {
                    if (!(err)){
                        fs.close(fileDescriptor, (err) => {
                            if (!err){
                                callback(false);
                            } else {
                                callback(`Error: Could not close file ${file}`);
                            }
                        });
                    } else {
                        callback(`Error: Could not append ${str} to file ${file}`);
                    }
                });
            } else {
                callback(`Error: Could not open ${file} for appending`);
            }
        });
    };

    /* list all the logs and optionally include the compressed logs */
    lib.list = (includeCompressedLogs, callback) => {

    };

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = lib;
/*  ---------------------------------------------------------- end of section */