process.on('uncaughtException', err => {
    console.error('global process error', err)
})

process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim()
process.env.MockConfig = (process.env.MockConfig || 'mock-server.json').trim()
process.env.EnablePortal = process.env.hasOwnProperty('EnablePortal') ? process.env.hasOwnProperty('EnablePortal') : 'true'


const Koa = require('koa'),
    setupMiddleware = require('./lib/middleware'),
    portal = require('./lib/portal'),
    Config = require('./lib/config')

var httpPort = Number(Config.port || process.env.PORT)
var portalApp

/**
 * Create HTTP server with KOA
 * @return {http.Server}
 */
function startServer(port) {
    process.env.EnablePortal && (portalApp = portal())
    httpPort = port || httpPort
    return run(httpPort)
}

function run(port) {
    const app = new Koa()
    setupMiddleware(app)

    const server = app.listen(port)
    server.timeout = (Number(Config.timeout) || 5 * 60) * 1000
    server.on('listening', onListening)
    server.on('error', onError)

    portalApp && portalApp.once('restart-mock', () => restart(server))

    return server
}

/**
 * @param {Error} error
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`Port ${httpPort} requires elevated privileges`)
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`Port ${httpPort} is already in use`)
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    if (process.env.NODE_ENV != 'development') return

    let msg = `[Reed Mock] mock server url: http://localhost:${httpPort}/`
    console.info(msg)
}

function restart(server) {
    console.log('[Reed Mock] restarting server...')

    httpPort = Config.port ||  server.address().port
    server.close(() => run(httpPort))
}


if (!module.parent) startServer()

exports.startServer = startServer