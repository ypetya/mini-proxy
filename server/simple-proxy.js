var http = require('http'),
    https = require('https'),
    console = require('console'),
    Builder = require('../utils/pretty-print'),
    qs = require('querystring');

module.exports = SimpleProxy;

/*
 API:
 fwdOptions: {
 protocol: http|https
 cert: certificate path
 hostname: String - where to forward request
 port: Number - where to forward request
 pathCb: String:function(String) - transform path to forward
 headersCb: Array:function(Array) - transform headers to forward
 passThrough: Boolean:function(req,response to local connection, response from remote endpoint)
 }
 */
function SimpleProxy(regex, fwdOptions) {

    this.createRequest = http.request;

    if (fwdOptions.protocol == 'https') {
        this.createRequest = https.request;
    }

    this.matches = function pathMatcher(req) {
        return !!req.url.path.match(regex);
    };

    this.requestHandler = function forward(req, res) {
        var postData = req.method === 'POST' || req.method === 'PUT';
        if (postData) {
            req.on('data', function (data) {
                data = transformData(data); // TODO recalculate Content-Length
                req2.write(data);
            });
            req.on('end', function () {
                console.log('req2 close');
                req2.end();
            });
        }

        this.options = createOptions(req);

        var req2 = this.createForwardRequest(req, res);
        if(!postData) {
            req2.end();
        }
    };

    this.createForwardRequest = function (incomingRequest, responseToIncoming) {
        var newRequest = this.createRequest(this.options, function (responseFromOutgoing) {
            responseToIncoming.writeHead(responseFromOutgoing.statusCode, responseFromOutgoing.headers);

            if (passThrough(incomingRequest, responseToIncoming, responseFromOutgoing)) {
                responseFromOutgoing.pipe(responseToIncoming);
            }

            responseFromOutgoing.on('end', function () {
                console.log('resp in close');
                responseToIncoming.end();
            });
        });

        return newRequest;
    };

    function createOptions(req) {
        var headers = JSON.parse(JSON.stringify(req.headers));
        headers.host = fwdOptions.hostname;

        var options = {
            port: fwdOptions.port,
            hostname: fwdOptions.hostname,
            method: req.method,
            path: transformPath(req.url.path),
            headers: transformHeaders(headers)
        };

        if (fwdOptions.protocol == 'https') {
            options.key = fwdOptions.key;
            options.cert = fwdOptions.cert;
            options.passphrase = fwdOptions.passphrase;
            options.rejectUnauthorized = false;
        }

        logImportantOptions(options);
        return options;
    }

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

    function transformData(data) {
        var _strData = data.toString();
        logData(_strData);
        if (typeof(fwdOptions.dataCb) == 'function') {
            _strData = fwdOptions.dataCb(_strData);
        }
        // how to create buffer?
        return _strData;
    }

    function logData(postData) {
        var d = qs.parse(postData);
        logJson(d);
    }

    function passThrough(req, localResponse, remoteResponse) {
        var ret = true;
        if (typeof(fwdOptions.passThrough) == "function") {
            ret = fwdOptions.passThrough(req, localResponse);
        }
        return ret;
    }
}

function logImportantOptions(options) {
    var formatted = new Builder(options);

    formatted.add('method').add('hostname').add('port').add('path').add('headers');

    console.log('FWD TO ' + formatted.build());
}

function logJson(obj) {
    var formatted = new Builder();
    formatted.addJson(obj);
    console.log(formatted.build());
}