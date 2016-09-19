// RULES - always reloaded
var console = require('console'),
    fs = require('fs'),

    StaticFileServer = require('./processor/static-file-server'),
    staticFiles = new StaticFileServer(),

    testEndpoint = require('./processor/test-endpoint-server'),

    Proxy = require('./processor/proxy');

module.exports = [

    testEndpoint,

    //   staticFiles,
    /*
     new ForwardServlet(/^\/api/, {
     hostname: REMOTE_SERVER,
     port: 80
     }),
     */
    new Proxy({
        regex: /^\/.*/,
        hostname: process.argv[2],
        port: 443,
        protocol: 'https',
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
        passphrase: '1234'
    })

];
