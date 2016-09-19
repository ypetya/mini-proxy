var http = require('http'),
    https = require('https');

module.exports = RequestSetup;

function RequestSetup() {

}

RequestSetup.prototype.setupProtocol= function setupProtocol() {
    this.createRequest = http.request;

    if (this.protocol == 'https') {
        this.createRequest = https.request;
    }
};