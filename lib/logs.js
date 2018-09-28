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
        purpose:    append a string to a file, create the file if it does not exist
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
        fs.readdir(lib.baseDir, (err, data) => {
            if (!err & data & data.length > 0){
                let trimmedFileNames = [];
                data.forEach((fileName) => {
                    // add the .log files to the array
                    if (fileName.indexOf('.log') > -1) {
                        trimmedFileNames.push(fileName.replace('.log', ''));
                    }

                    // add the compressed files (.gz.b64) to the array if required to
                    if (includeCompressedLogs && fileName.indexOf('.gz.b64') > -1){
                        trimmedFileNames.push(data.replace('.gz.b64', ''));
                    }
                });
                callback(false, trimmedFileNames);
            } else {
                callback(err, data);
            }
        });
    };

    /*  
        purpose :   compress the contents of a .log file into a .gz.b64 file within the same directory
        inputs:     logId:      name of the source file
                    newFileId:  name of the compressed file
    */
    lib.compress = (logId, newFileId, callback) => {
        let sourceFile = lib.baseDir.concat(logId).concat('.log');
        let destFile = lib.baseDir.concat(newFileId).concat('.gz.b64');

        fs.readFile(sourceFile, 'utf8', (err, inputString) => {
            if (!err && inputString){
                // compress the data with gzip
                zlib.gzip(inputString, (err, buffer) => {
                    if (!err && buffer){
                        // send the zipped data to the destination file
                        fs.open(destFile, 'wx', (err, fileDescriptor) => {
                            if (!err && fileDescriptor){
                                //  write the zipped data to the destination file
                                fs.write(fileDescriptor, buffer.toString('base64'), (err) => {
                                    if (!err) {
                                        // close the destination file
                                        fs.close(fileDescriptor, (err) => {
                                            if (!err) {
                                                callback(false);
                                            } else {
                                                callback(err);
                                            }
                                        });
                                    } else {
                                        callback(err);
                                    }
                                });
                            } else {
                                callback(err);
                            }
                        });
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    };

    /*  
        purpose :   decompress the contents of a .gz file 
        inputs:     fileId:     name of the file to decompress
        callback:   a string will be returned of the unzipped contents
    */
    lib.decompress = (fileId, callback) => {
        let fileName = lib.baseDir.concat(fileId).concat('.gz.b64');
        fs.readFile(fileName, 'utf8', (err, str) => {
            if (!err && str) {
                // inflate the data
                let inputBuffer = Buffer.from(str, 'base64');
                zlib.unzip(inputBuffer, (err, outputBuffer) => {
                    if (!err && outputBuffer) {
                        let str = outputBuffer.toString();
                        callback(false, str);
                    } else {
                        callback(err);
                    }
                });
            } else {
                callback(err);
            }
        });
    };

    /*  
        purpose :   truncate a log file 
        inputs:     logId:  name of the file to truncate
    */
    lib.truncate = (logId, callback) => {
        fs.truncate(lib.baseDir.concat(logId).concat('.log'), 0, (err) => {
            if (!err) {
                callback(false);
            } else {
                callback(err);
            }
        });
    };

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = lib;
/*  ---------------------------------------------------------- end of section */