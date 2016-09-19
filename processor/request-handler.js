var Processor = require('./processor'),
    console = require('console');

module.exports = RequestHandler;

function RequestHandler() {
    // on every callback this should be point to this instance!
    this.requestHandler = RequestHandler.prototype.requestHandler.bind(this);
}

RequestHandler.prototype = Object.create(Processor.prototype);
RequestHandler.prototype.constructor = RequestHandler;
RequestHandler.prototype.requestHandler = function forward(req, res) {
    var postData = req.method === 'POST' || req.method === 'PUT',
        forwardRequest;
    this.incomingRequest = req;
    this.responseToIncoming = res;
    this.headers = clone(this.incomingRequest.headers);

    // FIXME : handle only with postData and without! - no "if" here
    if (postData) {
        this.incomingRequest.on('data', function (data) {
            this.data = this.transformPostData(data);

            if (!forwardRequest) {
                forwardRequest = this.createForwardRequest();
            }
            forwardRequest.write(data);
        }.bind(this));
        this.incomingRequest.on('end', function () {
            console.log('Request closed');
            forwardRequest.end();
        });
    } else {
        this.data = undefined;
        forwardRequest = this.createForwardRequest();
        forwardRequest.end();
    }
};

RequestHandler.prototype.transformPostData = function (data) {
    var transformedData = data;
    if (typeof(data) == 'string') {
        transformedData = data.replace(/localhost%3A8001/g, this.hostname);
    }
    return transformedData;
};

/*

 qs = require('querystring')
 function logData(postData) {
 var d = qs.parse(postData);
 prettyPrint.logJson(d);
 }*/

function clone(o) {
    return JSON.parse(JSON.stringify(o));
}