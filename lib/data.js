/* File Description:
 * 
 * Library for storing and editing data to files in the data folder.
 * 
 *********************************************************************/

/*  Dependencies section:
    ---------------------   */
    const fs = require('fs');
    const path = require('path');
    const helpers = require('./helpers');

/*  ---------------------------------------------------------- end of section */

 /*  Main section:
    -------------   */

    // create a container for the data library
    let lib = {};

    // base directory for data folder
    lib.baseDir = path.join(__dirname, '/../.data');

    /*  
        purpose:    write data to a file
        inputs:     dir:    directory to create the file in within the .data folder;
                    file:   file name to create and write data to;
                    data:   JSON object
    */
    lib.create = (dir, file, data, callback) => {
        // open the file for writing
        fs.open(lib.baseDir.concat(dir).concat('/').concat(file).concat('.json'), 'wx', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                let stringData = JSON.stringify(data);
                // write to the file and close it
                fs.writeFile(fileDescriptor, stringData, (err) => {
                    if (!err) {
                        fs.close(fileDescriptor, (err) => {
                            if (!err) {
                                callback(false);
                            } else {
                                callback(`Error: could not close new file ${file}`);
                            }
                        });
                    } else {
                        callback(`Error: could not write to new file ${file}`);
                    }
                });
            } else {
                callback(`Error: could not create new file ${file}, it may already exist`);
            }
        });
    };

    /*  
        purpose:    read data from a file
        inputs:     dir:    directory to where the file resides;
                    file:   file name to read;
        callback:   contents of file as a JSON object
    */
    lib.read = (dir, file, callback) => {
        fs.readFile(lib.baseDir.concat(file).concat('.json'), 'utf8', (err, data) => {
            if (!err && data) {
                callback(false, helpers.parseJsonToObject(data));
            } else {
                callback(err, data);
            }
        });
    };

    /*  
        purpose:    update data in a file
        inputs:     dir:    directory to where the file resides;
                    file:   file name to update;
                    data:   data to update file passed in as a JSON object.
    */
    lib.update = (dir, file, data, callback) => {
        fs.open(lib.baseDir.concat(dir).concat('/').concat(file).concat('.json'), 'r+', (err, fileDescriptor) => {
            if (!err && fileDescriptor) {
                let stringData = JSON.stringify(data);
                fs.truncate(fileDescriptor, (err) => {
                    if (!err) {
                        fs.writeFile(fileDescriptor, stringData, (err) => {
                            if (!err) {
                                fs.close(fileDescriptor, (err) => {
                                    if (!err) {
                                        callback(false);
                                    } else {
                                        callback(`Error: could not close file ${file}`);
                                    }
                                });
                            } else {
                                callback(`Error: writing to existing file ${file}`);
                            }
                        });
                    } else {
                        callback(`Error: truncating file ${file}`);
                    }
                });
            } else {
                callback(`Error: could not open file, ${file}, for updating; it may not exist yet`);
            }
        });
    };

    /*  
        purpose:    delete a file
        inputs:     dir:    directory to where the file resides;
                    file:   file name to delete;
    */
    lib.delete = (dir, file, callback) => {
        fs.unlink(lib.baseDir.concat(dir).concat('/').concat('.json'), (err) => {
            callback(err);
        });
    };

    /*  
        purpose:    list all of the files in a directory without the extension
        inputs:     dir:    directory to list the files from;
    */
    lib.list = (dir, callback) => {
        fs.readdir(lib.baseDir.concat('dir').concat('/'), (err, data) => {
            if (!err && data && data.length > 0) {
                let trimmedFileNames = [];
                data.forEach((filename) => {
                    trimmedFileNames.push(filename.replace('.json', ''));
                });
                callback(false, trimmedFileNames);
            } else {
                callback(err, data);
            }
        });
    };

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = lib;
/*  ---------------------------------------------------------- end of section */ 