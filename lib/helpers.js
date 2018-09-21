/* File Description:
 * 
 * Helpers for all custom libraries
 * 
 ******************************************************************************/

/*  Dependencies section:
    ---------------------   */

/*  ---------------------------------------------------------- end of section */

/*  Main section:
    -------------   */

    // create a container for all the helpers
    let helpers = {};
  
    /*
        method:     accepts a string in JSON format
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
        method:     return a color string for the console to display
        inputs:     code: can a string color, eg. red, white, etc. or a status code number, eg. 200, 400
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

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = helpers;
/*  ---------------------------------------------------------- end of section */