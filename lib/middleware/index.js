const koaBody = require('koa-body'),
    cors = require('@koa/cors'),
    Config = require('../config'),
    { catchGlobalError, setNotFound, setIndex } = require('./response')

/**
 * @param {Koa} app
 */
function setupMiddleware(app) {
    const hasEndpoint = s => s && s.enabled && s.endpoints && s.endpoints.length

    const allowStatic = hasEndpoint(Config.serveStatic),
        allowApi = hasEndpoint(Config.serveApi),
        allowWs = hasEndpoint(Config.serveWebsocket),
        allowProxy = hasEndpoint(Config.serveProxy),
        frontMw = Config.customMiddleware && Config.customMiddleware.front && Config.customMiddleware.front.length,
        lastMw = Config.customMiddleware && Config.customMiddleware.last && Config.customMiddleware.last.length,
        allowCors = Config.cors

    frontMw && Config.customMiddleware.front.forEach(s => app.use(require(s)))

    app.use(catchGlobalError)

    allowCors && app.use(cors())
    //.use(getKoaLogger('http'))
    allowProxy && app.use(require('../proxy')())
    allowWs && require('../ws')(app)

    app.use(koaBody())
    allowApi && app.use(require('./api')())
    allowStatic && app.use(require('./static')())

    lastMw && Config.customMiddleware.last.forEach(s => app.use(require(s)))

    app.use(setIndex).use(setNotFound)
}


module.exports = setupMiddleware