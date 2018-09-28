/* File Description:
 * 
 * Configuration settings for API
 * 
 ******************************************************************************/

 /*  Main section:
    -------------   */

    // create a container for all environments
    let environment = {};

    // staging environment (Default)
    environment.staging = {
        'httpPort': 3000,
        'httpsPort': 3001,
        'envName': 'staging',
        'hashingSecret': 'thisIsASecret'
    };

    // production environment
    environment.production = {
        'httpPort': 5000,
        'httpsPort': 5001,
        'envName': 'production',
        'hashingSecret': 'thisIsASecureSecret'
    };

    // determine which environment was passed as a command line parameter
    let currentEnvironment = typeof(process.env.NODE_ENV == 'string') ? 
        process.env.NODE_ENV.toLowerCase() : 
        '';

    // verify that the current environment is a defined type; 
    // if not then use the Staging environment as the default
    let environmentToExport = typeof(environment[currentEnvironment] == 'object') ? 
        environment[currentEnvironment] : 
        environment.staging;

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = environmentToExport;
/*  ---------------------------------------------------------- end of section */