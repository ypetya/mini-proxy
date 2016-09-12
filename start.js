#!/usr/bin/env node

var fs = require('fs'),
    events = require('events'),
    HttpServer = require('./http-server'),
    HttpsServer = require('./https-server'),
    Callbacks = require('./callbacks'),
    callbacks = new Callbacks();

var DEFAULT_PORT = 8000;

function main(argv) {
    new HttpServer(callbacks.handle).start(DEFAULT_PORT);
    new HttpsServer(callbacks.handle).start(DEFAULT_PORT+1);
}


// Must be last,
main(process.argv);