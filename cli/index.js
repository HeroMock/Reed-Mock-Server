#!/usr/bin/env node

const path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    program = require('commander')

program
    .version(require('../package.json').version)

program
    .command('init')
    .description('init config for mock server')
    .action(initServer)

program
    .command('start [config]')
    .description('start mock server')
    .action(startServer)

program
    .parse(process.argv)


function initServer() {
    ['mock-server.json', 'json.hbs'].forEach(s => {
        fs.copyFile(
            path.join(__dirname, '..', s),
            path.join(process.cwd(), s),
            e => e ? console.error(e.message) : console.log(`mock server ${s} initialized`)
        )
    })
}

function startServer(config) {
    process.env.MockConfig = config || ''
    require('../index').startServer()
}