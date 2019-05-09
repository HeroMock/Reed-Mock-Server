#!/usr/bin/env node

const program = require('commander')

program
    .version(require('../package.json').version, '-v, --version')
    .command('init', 'init config for mock server').action(initServer)
    .parse(process.argv)

function initServer() {
    console.log('init server')
}