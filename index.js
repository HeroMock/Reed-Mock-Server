const http = require('http'),
    Koa = require('koa'),
    koaBody = require('koa-body'),
    liveConfig = require('liveconfig')

process.on('uncaughtException', err => {
    console.error('global process error', err)
})

const Config = liveConfig(__dirname)['mock-server']

process.env.NODE_ENV = (process.env.NODE_ENV || 'development').trim()
const httpPort = Number(process.env.PORT || Config.port)


/**
 * Create HTTP server with KOA
 * @return {http.Server}
 */
function startServer() {

    const app = new Koa()
    setMiddleware(app)

    const server = app.listen(httpPort)
    server.on('listening', onListening)
    server.on('error', onError)

    return server
}

/**
 * @param {Koa} app
 */
function setMiddleware(app) {
    app.use(catchGlobalError)
        // .use(getKoaLogger('http'))
        // .use(setViewRender(path.resolve(__dirname, 'views')))
        .use(koaBody())
        // .use(router)
        .use(processNotFound)
}


/**
 * @param {Koa.Context} ctx
 * @param {Function} next
 */
async function catchGlobalError(ctx, next) {
    try {
        await next()
    } catch (error) {
        ctx.status = error.status | 500
        let msg = process.env.NODE_ENV === 'development' ? error.message : '500: Server Internal Error'
        ctx.body = { error: msg }
        ctx.app.emit('error', error, ctx)
    }
}

/**
 * @param {Koa.Context} ctx
 */
async function processNotFound(ctx) {
    ctx.status = 404;

    switch (ctx.accepts('html', 'json')) {
        case 'html':
            ctx.type = 'html'
            await ctx.render('404', Config.App)
            break;
        case 'json':
            ctx.body = {
                error: '404'
            }
            break;
        default:
            ctx.type = 'text'
            ctx.body = 'Page Not Found'
    }
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