#!/usr/bin/env node

var fs = require('fs'),
    events = require('events'),
    HttpServer = require('./http-server'),
    Callbacks = require('./callbacks'),
    callbacks = new Callbacks();

var DEFAULT_PORT = 8000;

function main(argv) {
    new HttpServer(callbacks.handle).start(Number(argv[2]) || DEFAULT_PORT);
}


// Must be last,
main(process.argv);