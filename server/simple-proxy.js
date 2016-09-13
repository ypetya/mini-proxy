var http = require('http'),
    console = require('console'),
    Builder = require('../utils/pretty-print');

module.exports = SimpleProxy;

/*
 API:
 fwdOptions: {
 hostname: String - where to forward request
 port: Number - where to forward request
 pathCb: String:function(String) - transform path to forward
 headersCb: Array:function(Array) - transform headers to forward
 passThrough: Boolean:function(req,response to local connection, response from remote endpoint)
 }
 */
function SimpleProxy(regex, fwdOptions) {

    this.matches = function pathMatcher(req) {
        return !!req.url.path.match(regex);
    };

    this.requestHandler = function forward(req, res) {
        var headers = JSON.parse(JSON.stringify(req.headers));
        delete headers.host;
        // make a request to a tunneling proxy
        var options = {
            port: fwdOptions.port,
            hostname: fwdOptions.hostname,
            method: req.method,
            path: transformPath(req.url.path),
            headers: transformHeaders(headers)
        };

        console.log('FWD TO ' + pretty(options));

        var req2 = http.request(options, function (res2) {
            res.writeHead(res2.statusCode, res2.headers);

            if (passThrough(req, res, res2)) {
                res2.pipe(res);
            }

            res2.on('end', function () {
                res.end();
            });
        });
        req2.end();
    };

    function transformPath(path) {
        if (typeof(fwdOptions.pathCb) == "function") {
            path = fwdOptions.pathCb(path);
        }
        return path;
    }

    function transformHeaders(headers) {
        if (typeof(fwdOptions.headersCb) == "function") {
            headers = fwdOptions.headersCb(headers);
        }
        return headers;
    }

    function passThrough(req, localResponse, remoteResponse) {
        var ret = true;
        if (typeof(fwdOptions.passThrough) == "function") {
            ret = fwdOptions.passThrough(req, localResponse);
        }
        return ret;
    }
}

function pretty(options) {
    var formatted = new Builder(options);

    formatted.add('method').add('hostname').add('port').add('path');

    return formatted.build();
}