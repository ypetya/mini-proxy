#!/usr/bin/env node

var HttpServer = require('./server/http-server'),
    HttpsServer = require('./server/https-server'),
    callbacks = require('./utils/callback-handlers');

var DEFAULT_PORT = 8000;

main(process.argv);

function main(argv) {
    new HttpServer(callbacks).start(DEFAULT_PORT);
    new HttpsServer(callbacks).start(DEFAULT_PORT+1);
}
