const koaBody = require('koa-body'),
    cors = require('@koa/cors'),
    Config = require('../config'),
    { catchGlobalError, setNotFound, setIndex } = require('./response')

/**
 * @param {Koa} app
 */
function setupMiddleware(app) {
    const allowStatic = Config.serveStatic && Config.serveStatic.enabled && !!Config.serveStatic.dirPath,
        allowApi = Config.serveApi && Config.serveApi.enabled && !!Config.serveApi.filePath,
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled && Config.serveWebsocket.endpoints && Config.serveWebsocket.endpoints.length,
        allowProxy = Config.serveProxy && Config.serveProxy.enabled && Config.serveProxy.endpoints && Config.serveProxy.endpoints.length,
        frontMw = Config.customMiddleware && Config.customMiddleware.front && Config.customMiddleware.front.length,
        lastMw = Config.customMiddleware && Config.customMiddleware.last && Config.customMiddleware.last.length


    frontMw && Config.customMiddleware.front.forEach(s => app.use(require(s)))

    app.use(catchGlobalError).use(cors())
    //.use(getKoaLogger('http'))
    allowProxy && app.use(require('../proxy')())
    allowWs && require('../ws')(app)

    app.use(koaBody())
    allowApi && app.use(require('../api')())
    allowStatic && app.use(require('../static')())

    lastMw && Config.customMiddleware.last.forEach(s => app.use(require(s)))

    app.use(setIndex).use(setNotFound)
}


module.exports = setupMiddleware