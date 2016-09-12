#!/usr/bin/env node

var fs = require('fs'),
    events = require('events'),
    HttpServer = require('./server/http-server'),
    HttpsServer = require('./server/https-server'),
    callbacks = require('./utils/callback-handlers');

var DEFAULT_PORT = 8000;

function main(argv) {
    new HttpServer(callbacks).start(DEFAULT_PORT);
    new HttpsServer(callbacks).start(DEFAULT_PORT+1);
}


// Must be last,
main(process.argv);