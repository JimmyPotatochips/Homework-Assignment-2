/**
 * 
 * Configuration settings for API
 * 
 */

/**
 * Main initialization section
 *****************************/

 //-- Create a container for all environments
 const environment = {};

 //-- Staging environment (Default)
 environment.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging'
 };

 //-- Production environment
 environment.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'
 };

 //-- Determine which environment was passed as a command line parameter
 let currentEnvironment = typeof(process.env.NODE_ENV == 'string') ? process.env.NODE_ENV.toLowerCase() : '';

 //-- Verify that the current environment is a defined type, if not then use the Staging environment as the default
 let environmentToExport = typeof(environment[currentEnvironment] == 'object') ? environment[currentEnvironment] : environment.staging;

/**
 * Export section
 ****************/

 module.exports = environmentToExport;