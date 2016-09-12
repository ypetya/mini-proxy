// RULES - always reloaded
var console = require('console'),
    fs = require('fs'),
    StaticServlet = require('./server/static-servlet');
    staticServlet = new StaticServlet(),
    ForwardServlet = require('./simple-proxy'),
    index = new ForwardServlet(/^\/api/, {
      hostname: 'apihost',
      port: 80
    });

module.exports = [
    {
        matches: function (request) {
            return request.url.path.indexOf('TEST') > -1;
        },
        requestHandler: function(request,res) {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.write('PROXY is UP');
            res.end();
        }
    },

    index,

    // === LAST RULE =======
    staticServlet
];
