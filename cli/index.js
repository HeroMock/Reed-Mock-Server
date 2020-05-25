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
    .option('-p, --port <port>', 'Set port', 3000)
    .option('-P, --portal-port <port>', 'Set portal port', 3001)
    .option('-s, --static-endpoint <path>', 'Set static server endpoint')
    .option('--static-dir <dir>', 'Set static files directory', './dist')

    .option('--api, --api-endpoint <path>', 'Set api endpoint')
    .option('--api-data-path <dir>', 'Set api data config\'s path', './json-api.hbs')

    .option('--ws, --ws-endpoint <path>', 'Set Websocket webpoint')
    .option('--ws-data-path <dir>', 'Set Websocket data config\'s path', './json-ws.hbs')

    .option('--nc, --no-cors', 'Disable Cross-Origin Resource Sharing')
    .description('start mock server')
    .action(startServer)

program
    .parse(process.argv)


function initServer() {
    const configFile = 'mock-server.json'
    const serverConfig = require(path.join('../sample', configFile));

    [
        ['serveApi', ['json-api.hbs']],
        ['serveWebsocket', ['json-ws1.hbs', 'json-ws2.hbs']]
    ].forEach(([node, confs]) => {
        serverConfig[node].endpoints.forEach((ep, index) => {
            ep.filePath = confs[index]
        })
        confs.forEach(f => {
            fs.copyFile(
                path.join(__dirname, '../sample/templates', f),
                path.join(process.cwd(), f),
                e => e ? console.error(e.message) : console.log(`[Reed Mock] template ${wrap(f, 'green', 'bold', 'italic')} initialized`)
            )
        })
    })

    serverConfig.serveStatic.endpoints.forEach(s=> s.dirPath = './dist')
    fs.writeFileSync(path.join(process.cwd(), configFile), JSON.stringify(serverConfig, null, 2))
    console.log(`[Reed Mock] config ${wrap(configFile, 'green', 'bold', 'italic')} initialized`)
}

function startServer(config, cmd) {
    parseArgv(config, cmd)
    require('../index').startServer()
}

function parseArgv(config, cmd) {
    process.env.MockConfig = config || ''
    const Config = require('../lib/config')
    Config.cors = cmd.cors
    Config.portal = Config.portal || {}
    Config.portal.port = cmd.portalPort
    if (!config) {
        process.env.MockConfig = path.join(process.cwd(), 'mock-server.json')
        cmd.port && (Config.port = +cmd.port)
        if (cmd.staticEndpoint) {
            Config.serveStatic = {
                enabled: true,
                endpoints: [
                    {
                        endpoint: cmd.staticEndpoint,
                        indexPages: [
                            'index.html',
                            'index.htm'
                        ],
                        dirPath: cmd.staticDir
                    }
                ]
            }

        }
        if (cmd.apiEndpoint) {
            Config.serveApi = {
                enabled: true,
                endpoints: [
                    {
                        endpoint: cmd.apiEndpoint,
                        filePath: cmd.apiDataPath,
                        options: {}
                    }
                ]
            }

        }
        if (cmd.wsEndpoint) {
            Config.serveWebsocket = {
                enabled: true,
                endpoints: [
                    {
                        endpoint: cmd.wsEndpoint,
                        filePath: cmd.wsDataPath,
                        options: {}
                    }
                ]
            }

        }
    }
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