#!/usr/bin/env node
const path = require('path');
const flatten = require('..');

console.log(flatten(path.resolve(process.cwd(), process.argv[2])));
