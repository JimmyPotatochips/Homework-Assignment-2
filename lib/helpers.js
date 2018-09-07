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
  helpers.debugColor = ((code) => {
    switch (code){
        case 200:
            return '\x1b[32m%s\x1b[0m';
        default:
            return '\x1b[31m%s\x1b[0m';
    }
  });