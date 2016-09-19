module.exports = ResponseHandler;

function ResponseHandler() {
    this.responseHandler = ResponseHandler.prototype.responseHandler;
}

ResponseHandler.prototype.responseHandler = function (responseFromOutgoing) {
    console.log('Response status: ' + responseFromOutgoing.statusCode);
    this.responseToIncoming.writeHead(responseFromOutgoing.statusCode, responseFromOutgoing.headers);

    if ( typeof(this.passThrough) !== 'function' ||
        this.passThrough(this.incomingRequest, this.responseToIncoming, responseFromOutgoing)) {
        // TODO insert processing here
        responseFromOutgoing.pipe(this.responseToIncoming);
    }

    responseFromOutgoing.on('end', function () {
        console.log('Response closed');
        this.responseToIncoming.end();
    }.bind(this));
};
