var Server = require('./server'),
    console = require('console'),
    http = require('http');

module.exports = HttpServer;

function HttpServer(handlerCb) {
    this.server = new Server(handlerCb);
    var wrappedServer = http.createServer(this.server.handleRequest);
    this.server.init(wrappedServer);

    this.start = start;
}

function start(port) {
    this.server.start(port);
    console.log('Http Server running at http://localhost:' + port + '/');
}