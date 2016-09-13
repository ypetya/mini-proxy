// RULES - always reloaded
var console = require('console'),
    fs = require('fs'),

    StaticFileServer = require('./server/static-file-server'),
    staticFiles = new StaticFileServer(),

    testEndpoint = require('./server/test-endpoint-server'),

    ForwardServlet = require('./server/http-proxy');

var REMOTE_SERVER = process.argv[2];

module.exports = [

    testEndpoint,

    //   staticFiles,
    /*
     new ForwardServlet(/^\/api/, {
     hostname: REMOTE_SERVER,
     port: 80
     }),
     */
    new ForwardServlet(/^\/.*/, {
        hostname: REMOTE_SERVER,
        port: 443,
        protocol: 'https',
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
        passphrase: '1234',
        headersCb: function (headers) {
            if (typeof(headers.referer) == 'string') {
                headers.referer = headers.referer.replace(/localhost:8001/, REMOTE_SERVER);
            }
            if (typeof(headers.origin) == 'string') {
                headers.origin = headers.origin.replace(/localhost:8001/, REMOTE_SERVER);
            }
            return headers;
        },
        pathCb: function (path) {
            var transformedPath = path;
            if (typeof(path) == 'string') {
                transformedPath = path.replace(/localhost%3A8001/g, REMOTE_SERVER);
            }
            return transformedPath;
        },
        dataCb: function (data) {
            var transformedData = data;
            if (typeof(data) == 'string') {
                transformedData = data.replace(/localhost%3A8001/g, REMOTE_SERVER);
            }
            return transformedData;
        }
    })

];
