/**
 * 
 * Initial entry for API, creates the web server
 * 
 */

/**
 * Dependencies section
 **********************/

 const server = require('./lib/server');
 const workers = require('./lib/workers');

/**
 * Main initialization section
 *****************************/
 
 //-- Create a container for the app
 let app = {};

 //-- Initialize the app and execute it
 app.init = (() => {

    //-- Start the server
    server.init();

    //-- Start the workers
    workers.init();

 })();

/**
 * Export section
 ****************/

 module.exports = app;