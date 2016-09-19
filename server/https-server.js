var Server = require('./server'),
    console = require('console'),
    fs = require('fs'),
    https = require('https');

module.exports = HttpsServer;

function HttpsServer(handlerCb) {
    Server.call(this, handlerCb);

    this.options = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
        passphrase: '1234'
    };
    this.init();
}

HttpsServer.prototype = Object.create(Server.prototype);
HttpsServer.prototype.constructor = HttpsServer;
HttpsServer.prototype.start = function startWithLogging(port) {
    Server.prototype.start.call(this,port);
    console.log('Https Server running at https://localhost:' + port + '/');
};
HttpsServer.prototype.init = function initHttps() {
    var wrappedServer = https.createServer(this.options, Server.prototype.handleRequest.bind(this));
    Server.prototype.init.call(this, wrappedServer);
};