/**
 * 
 * Server related functions
 * 
 */

/**
 * Dependencies section
 **********************/

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

/**
 * Main section
 **************/

 //-- Create a container for the server
 let server = {};

 //-- Instantiate the HTTP server
 server.httpServer = http.createServer((req, res) => {
    server.properties(req, res);
 });

 //-- Set the HTTPS server options
 server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
 };

 //-- Instantiate the HTTPS server
 server.httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    server.properties(req, res);
 });

 //-- Retrieve the properties for the server 
 server.properties = ((req, res) => {
    //-- Parse the url from the request object
    let parsedUrl = url.parse(req.url, true);

    //-- Get and trim the path
    let path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    //-- Get the query string as an object
    let queryString = parsedUrl.query;

    //-- Get the HTTP method used
    let method = req.method.toLowerCase();

    //-- Get the headers as an object
    let headers = req.headers;

    //-- Get the payload and build from the stream
    let decoder = new StringDecoder('utf8');
    let buffer = '';

    //-- Data event emitted, decode the stream and add to the buffer
    req.on('data', (data) => {
        buffer += decoder.write(data);
    });

    //-- End event emitted, decode the last packet of the stream and call the handler
    req.on('end', () => {
        buffer += decoder.end();

        //-- Construct the data object to send to the handler
        let data = {
            'path': path,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        };

        //-- Route the request
        server.route(data);
    });
 });

 //-- Handle the routing of the request
 server.route = ((data) => {
    //-- Check the router for a matching path for a handler.
    //-- If a handler is not found, use the 'notFound' handler.
    let chosenHandler = typeof(server.router[data.path]) !== 'undefined' ? server.router[data.path] : handlers.notFound;

    //-- Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
        //-- If an invalid status code is returned (NaN), then return a default of 200
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

        //-- Use the payload returned from the handler, or set the default payload to an empty object
        payload = typeof(payload == 'object') ? payload : {};

        //-- Convert the payload to a string
        let payloadString = JSON.stringify(payload);

        //-- Return the response with the content-type, status code, and payload string
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(statusCode);
        res.end(payloadString);

        debug(helpers.debugColor(statusCode), `${data.method.toUpperCase()} /${data.path} ${statusCode}`);
    });
 });

 //-- Setup the handlers for the server router
 server.router = {
   'users': handlers.users
 };

 //-- Create the init method, initial call into this library
 server.init = (() => {
    //-- Start listening on the HTTP server
    server.httpServer.listen(config.httpPort, () => {

    });

    //-- Start listening on the HTTPS server
    server.httpsServer.listen(config.httpsPort, () =>{

    });
 });