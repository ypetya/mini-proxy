var console = require('console'),
    url = require('url');

module.exports = Server;

function Server(handlerCb) {
    this.handlerCb = handlerCb;
    this.handleRequest = handleRequest.bind(this);
    this.init = init;
    this.start = start;
}

function handleRequest(req, res) {
    var logEntry = req.method + ' ' + req.url;
    if (req.headers['user-agent']) {
        logEntry += ' ' + req.headers['user-agent'];
    }
    console.log(logEntry);
    req.url = parseUrl(req.url);
    var handler = this.handlerCb(req);
    if (!handler) {
        res.writeHead(501);
        res.end();
    } else {
        handler.call(this, req, res);
    }
}

function init(server) {
    this.server = server;
}

function start(port) {
    this.port = port;
    this.server.listen(port);
}

function parseUrl(urlString) {
    var parsed = url.parse(urlString);
    parsed.pathname = url.resolve('/', parsed.pathname);
    return url.parse(url.format(parsed), true);
}
