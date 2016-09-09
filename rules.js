// RULES - always reloaded
var console = require('console'),
    fs = require('fs'),
    StaticServlet = require('./static-servlet');
    staticServlet = new StaticServlet();

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
    // === LAST RULE =======
    staticServlet
];