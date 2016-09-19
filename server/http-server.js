var Server = require('./server'),
    console = require('console'),
    http = require('http');

module.exports = HttpServer;

function HttpServer(handlerCb) {
    Server.call(this, handlerCb);

    this.init();
}

HttpServer.prototype = Object.create(Server.prototype);
HttpServer.prototype.constructor = HttpServer;
HttpServer.prototype.start = function startWithLogging(port) {
    Server.prototype.start.call(this, port);
    console.log('Http Server running at http://localhost:' + port + '/');
};
HttpServer.prototype.init = function initHttp() {
    var wrappedServer = http.createServer(Server.prototype.handleRequest.bind(this));
    Server.prototype.init.call(this, wrappedServer);
};