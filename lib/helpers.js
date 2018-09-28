/* File Description:
 * 
 * Helpers for all custom libraries
 * 
 ******************************************************************************/

/*  Dependencies section:
    ---------------------   */
    const config = require('./config');
    const crypto = require('crypto');
/*  ---------------------------------------------------------- end of section */

/*  Main section:
    -------------   */

    // create a container for all the helpers
    let helpers = {};
  
    /*
        purpose:    converts a JSON string to a JSON object
        inputs:     str: should be valid JSON format string
        returns:    a JSON object, if an error occurs during parsing, will return an empty object
    */
    helpers.parseJsonToObject = ((str) => {
        try{
            return JSON.parse(str);
        } catch (e) {
            return {}; // return an empty object
        }
    });

    /*
        purpose:    return a color string for the console to display
        inputs:     code: can be a string color, eg. red, white, etc. or a status code number, eg. 200, 400
        returns:    a string containing a special console color coding
    */
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

    /*
        purpose:    create a SHA256 hash
        inputs:     str: string to be hashed
        returns:    the hashed string
    */
    helpers.hash = (str) => {
        if (typeof(str) == 'string' && str.length > 0) {
            return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        } else {
            return false;
        }
    };

    /*
        purpose:    create a string of random alphanumeric characters for a given length
        inputs:     strLength: length of characters to create for the string
        returns:    a random alphanumeric string
    */
    helpers.createRandomString = (strLength) => {
        strLength = (typeof(strLength) == 'number' && strLength > 0) ? strLength : false;
        if (strLength) {
            // define all the possible characters that could go into a string
            let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

            let str = '';
            for(i = 1; i <= strLength; i++){
                // get a random character from the possible characters string
                let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                // append the randomCharacter to the return string
                str += randomCharacter;
            }
            return str;
        } else {
            return false;
        }
    };

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = helpers;
/*  ---------------------------------------------------------- end of section */