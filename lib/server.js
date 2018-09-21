/* File Description:
 * 
 * Server related functions
 * 
 ******************************************************************************/

/*  Dependencies section:
    ---------------------   */
    const http = require('http');
    const https = require('https');
    const url = require('url');
    const fs = require('fs');
    const path = require('path');
    const util = require('util');
    const debug = util.debuglog('server');
    const StringDecoder = require('string_decoder').StringDecoder;
    const config = require('./config');
    const handlers = require('./handlers');
    const helpers = require('./helpers');
/*  ---------------------------------------------------------- end of section */

/*  Main section:
    -------------   */

    // create a container for the server
    let server = {};

    // instantiate the HTTP server
    server.httpServer = http.createServer((req, res) => {
        server.properties(req, res);
    });

    // set the HTTPS server options
    server.httpsServerOptions = {
        'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
        'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
    };

    // instantiate the HTTPS server
    server.httpsServer = https.createServer(httpsServerOptions, (req, res) => {
        server.properties(req, res);
    });

    // retrieve the properties for the server 
    server.properties = ((req, res) => {
        // parse the url from the request object
        let parsedUrl = url.parse(req.url, true);

        // get and trim the path
        let path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

        // get the query string as an object
        let queryString = parsedUrl.query;

        // get the HTTP method used
        let method = req.method.toLowerCase();

        // get the headers as an object
        let headers = req.headers;

        // get the payload and build from the stream
        let decoder = new StringDecoder('utf8');
        let buffer = '';

        // data event emitted, decode the stream and add to the buffer
        req.on('data', (data) => {
            buffer += decoder.write(data);
        });

        // end event emitted, decode the last packet of the stream and call the handler
        req.on('end', () => {
            buffer += decoder.end();

            // construct the data object to send to the handler
            let data = {
                'path': path,
                'queryString': queryString,
                'method': method,
                'headers': headers,
                'payload': helpers.parseJsonToObject(buffer)
            };

            // route the request
            server.route(data);
        });
    });

    // handle the routing of the request
    server.route = ((data) => {
        // check the router for a matching path for a handler.
        // if a handler is not found, use the 'notFound' handler.
        let chosenHandler = typeof(server.router[data.path]) !== 'undefined' ? server.router[data.path] : handlers.notFound;

        // route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // if an invalid status code is returned (NaN), then return a default of 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // use the payload returned from the handler, or set the default payload to an empty object
            payload = typeof(payload == 'object') ? payload : {};

            // convert the payload to a string
            let payloadString = JSON.stringify(payload);

            // return the response with the content-type, status code, and payload string
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            debug(helpers.consoleColor(statusCode), `${data.method.toUpperCase()} /${data.path} ${statusCode}`);
        });
    });

    // setup the handlers for the server router
    server.router = {
        'users': handlers.users
    };

    // create the init method, initial call into this library
    server.init = (() => {
        // start listening on the HTTP server
        server.httpServer.listen(config.httpPort, () => {
            console.log(helpers.consoleColor('green'), `The HTTP server is running on port ${config.httpPort}`);
        });

        // start listening on the HTTPS server
        server.httpsServer.listen(config.httpsPort, () =>{
            console.log(helpers.consoleColor('blue'), `The HTTPS server is running on port ${config.httpsPort}`);
        });
    });

/*  ---------------------------------------------------------- end of section */

/*  Export section:
    ---------------   */
    module.exports = server.init;
/*  ---------------------------------------------------------- end of section */