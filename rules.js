// RULES - always reloaded
var console = require('console'),
    fs = require('fs'),

    StaticFileServer = require('./server/static-file-server'),
    staticFiles = new StaticFileServer(),

    testEndpoint = require('./server/test-endpoint-server'),

    ForwardServlet = require('./server/simple-proxy');

module.exports = [

    testEndpoint,

    staticFiles,

    new ForwardServlet(/^\/api/, {
        hostname: 'apiserver',
        port: 80
    })

];
