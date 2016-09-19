var RequestHandler = require('./request-handler'),
    prettyPrint = require('../utils/pretty-print'),
    ResponseHandler = require('./response-handler');

module.exports = ForwardRequest;

function ForwardRequest() {
    RequestHandler.call(this);
    ResponseHandler.call(this);
}

ForwardRequest.prototype = Object.create(RequestHandler.prototype);
ForwardRequest.prototype.constructor = ForwardRequest;

ForwardRequest.prototype.createForwardRequest = function () {
    this.createHeaders();
    this.createOptions(this.incomingRequest);
    return this.createRequest(this.options, this.responseHandler.bind(this));
};

ForwardRequest.prototype.createOptions = function (req) {
    var options = {
        port: this.port,
        hostname: this.hostname,
        method: req.method,
        path: this.transformPath(req.url.path),
        headers: this.headers
    };

    if (this.protocol == 'https') {
        options.key = this.key;
        options.cert = this.cert;
        options.passphrase = this.passphrase;
        options.rejectUnauthorized = false;
    }

    prettyPrint.logImportantOptions(options, 'method,hostname,port,path'.split(','));
    this.options = options;
};

ForwardRequest.prototype.transformPath = function (path) {
    var transformedPath = path;
    if (typeof(path) == 'string') {
        transformedPath = path.replace(/localhost%3A8001/g, this.hostname);
    }
    return transformedPath;
};

ForwardRequest.prototype.createHeaders = function () {
    if (this.data !== undefined) {
        var contentLength = Buffer.byteLength(this.data);
        this.headers['content-length'] = contentLength;
    }
    this.headers = this.transformHeaders(this.headers);
};


ForwardRequest.prototype.transformHeaders = function (headers) {
    headers.host = this.hostname;
    if (typeof(headers.referer) == 'string') {
        headers.referer = headers.referer.replace(/localhost:8001/, this.hostname);
    }
    if (typeof(headers.origin) == 'string') {
        headers.origin = headers.origin.replace(/localhost:8001/, this.hostname);
    }
    return headers;
};