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

const httpPort = Number(process.env.PORT || Config.port)

/**
 * Create HTTP server with KOA
 * @return {http.Server}
 */
function startServer(port) {
    const app = new Koa()
    setupMiddleware(app)

    const server = app.listen(port || httpPort)
    server.timeout = (Number(Config.timeout) || 5 * 60) * 1000
    server.restart = restart.bind(server)
    server.on('listening', onListening)
    server.on('error', onError)

    process.env.EnablePortal && portal(server)
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

    let msg = `[Reed Mock] server listening on port: ${httpPort}, node environment: ${process.env.NODE_ENV}`
    console.info(msg)
}

function restart() {
    console.log('[Reed Mock] restarting server...')

    const port = this.address().port
    this.close(() => this.listen(port))
}

if (!module.parent) startServer()

exports.startServer = startServer