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
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled,
        allowProxy = Config.serveProxy && Config.serveProxy.enabled && Config.serveProxy.endpoints && Config.serveProxy.endpoints.length


    app.use(catchGlobalError).use(cors())
    //.use(getKoaLogger('http'))

    allowProxy && app.use(require('../proxy')())
    allowWs && app.use(require('../ws')())

    app.use(koaBody())
    allowApi && app.use(require('../api')())
    allowStatic && app.use(require('../static')())

    app.use(setIndex).use(setNotFound)
}


module.exports = setupMiddleware