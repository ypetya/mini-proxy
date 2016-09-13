#!/bin/bash

SERVER="${1?param missing - remote server}"

node ./start.js "$SERVER"
