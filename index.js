/* File Description:
 * 
 * Initial entry for API, creates the web server
 * 
 ******************************************************************************/

/*  Dependencies section:
    ---------------------   */
    const server = require('./lib/server');
    const workers = require('./lib/workers');
/*  ---------------------------------------------------------- end of section */
 
/*  Main section:
    -------------   */

    // create a container for the app
    let app = {};

    // initialize the app and execute it
    app.init = (() => {
        // initialize the server and workers
        server.init();
        workers.init();
    })();

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = app;
/*  ---------------------------------------------------------- end of section */