#!/usr/bin/env node

const path = require('path'),
    fs = require('fs'),
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
    ['mock-server.json', 'json-api.hbs'].forEach(s => {
        fs.copyFile(
            path.join(__dirname, '..', s),
            path.join(process.cwd(), s),
            e => e ? console.error(e.message) : console.log(`mock server ${wrap(s, 'green', 'bold', 'italic')} initialized`)
        )
    })
}

function startServer(config) {
    process.env.MockConfig = config || ''
    require('../index').startServer()
}

function wrap(msg, ...keys) {
    if (!keys.length) return ''

    let [key, ...restKeys] = keys
    if (restKeys.length) return wrap(wrap(msg, key), ...restKeys)

    let ansiSet = {
            default: [0, 0],
            bgblack: [40, 49],
            bgblue: [44, 49],
            bgcyan: [46, 49],
            bggreen: [42, 49],
            bgred: [41, 49],
            bgmagenta: [45, 49],
            bgwhite: [47, 49],
            bgyellow: [43, 49],
            bold: [1, 22],
            blue: [34, 39],
            dim: [2, 22],
            white: [37, 39],
            italic: [3, 23],
            black: [30, 39],
            grey: [90, 39],
            underline: [4, 24],
            cyan: [36, 39],
            hidden: [8, 28],
            strikethrough: [9, 29],
            inverse: [7, 27],
            yellow: [33, 39],
            red: [31, 39],
            green: [32, 39],
            magenta: [35, 39],
            gray: [90, 39],
        },
        [a, b] = ansiSet[key]

    return `\u001b[${a}m${msg}\u001b[${b}m`
}