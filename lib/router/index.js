const path = require('path'),
    Router = require('koa-router'),
    Config = require('../config')

module.exports = function () {
    const router = new Router(),
        allowStatic = Config.serveStatic && Config.serveStatic.enabled && !!Config.serveStatic.dirPath,
        allowApi = Config.serveApi && Config.serveApi.enabled && !!Config.serveApi.filePath,
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled,
        allowProxy = Config.serveProxy && Config.serveProxy.enabled

    allowStatic && router.get('/*', require('../static')())
    allowApi && router.use(require('../api')(Config.serveApi.urlPrefix))
    allowWs && router.use(require('../ws')())
    allowProxy && router.use(require('../proxy')())

    router.get('/', ctx => {
        ctx.type = 'text'
        ctx.body = 'Mock server is running'
    })

    return router.routes()
}

