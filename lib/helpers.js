/**
 * 
 * Helpers for all custom libraries
 * 
 */

/**
 * Dependencies section
 **********************/

 /**
  * Main section
  **************/

  //-- Create a container for all the helpers
  let helpers = {};
  
  //-- Parse a JSON stringto an object in all cases without throwing an error
  helpers.parseJsonToObject = ((str) => {
    try{
        return JSON.parse(str);
    } catch (e) {
        return {}; // return an empty object
    }
  });

  //-- Return a color string for the console based on the code
  //-- code can be a color eg. green, red, white, etc. or a status code 200, 400, etc.
  helpers.consoleColor = ((code) => {
    switch (code){
        case 'green':
        case 200:
            return '\x1b[32m%s\x1b[0m';
        case 'red':
        case 400:
            return '\x1b[31m%s\x1b[0m';
        case 'black':
            return '\x1b[30m%s\x1b[0m';
        case 'yellow':
            return '\x1b[33m%s\x1b[0m';
        case 'blue':
            return '\x1b[34m%s\x1b[0m';
        case 'magenta':
            return '\x1b[35m%s\x1b[0m';
        case 'cyan':
            return '\x1b[36m%s\x1b[0m';
        case 'white':
            return '\x1b[37m%s\x1b[0m';
        default:
            return '\x1b[37m%s\x1b[0m';
    }
  });


/**
 * Export section
 ****************/

 module.exports = helpers;