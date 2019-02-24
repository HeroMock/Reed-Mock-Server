const http = require('http'),
    Koa = require('koa'),
    setupMiddleware = require('./lib/middleware'),
    Config = require('./lib/config')


process.on('uncaughtException', err => {
    console.error('global process error', err)
})

process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim()
const httpPort = Number(process.env.PORT || Config.port)


/**
 * Create HTTP server with KOA
 * @return {http.Server}
 */
function startServer() {

    const app = new Koa()
    setupMiddleware(app)

    const server = app.listen(httpPort)
    server.on('listening', onListening)
    server.on('error', onError)

    return server
}

/**
 * @param {Error} error
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    switch (error.code) {
        case "EACCES":
            console.error(`Port ${httpPort} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(`Port ${httpPort} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    let msg = `Listening on port: ${httpPort}, node environment: ${process.env.NODE_ENV}`
    console.info(msg)
}


if (!module.parent) startServer()

exports.startServer = startServer