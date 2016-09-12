var Server = require('./server'),
    console = require('console'),
    fs = require('fs'),
    https = require('https');

module.exports = HttpsServer;

function HttpsServer(handlerCb) {
    var options = {
        key: fs.readFileSync('./certs/key.pem'),
        cert: fs.readFileSync('./certs/cert.pem'),
        passphrase: '1234'
    };
    this.server = new Server(handlerCb);
    var wrappedServer = https.createServer(options, this.server.handleRequest);

    this.server.init(wrappedServer);

    this.start = start;
}

function start(port) {
    this.server.start(port);
    console.log('Https Server running at https://localhost:' + port + '/');
};
