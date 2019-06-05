const Router = require('koa-router'),
    Config = require('../config')

module.exports = function () {
    const router = new Router(),
        allowStatic = Config.serveStatic && Config.serveStatic.enabled && !!Config.serveStatic.dirPath,
        allowApi = Config.serveApi && Config.serveApi.enabled && !!Config.serveApi.filePath,
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled,
        allowProxy = Config.serveProxy && Config.serveProxy.enabled && Config.serveProxy.endpoints && Config.serveProxy.endpoints.length

    allowStatic && router.use(require('../static')())
    allowApi && router.use(require('../api')())
    allowWs && router.use(require('../ws')())
    allowProxy && router.use(require('../proxy')())

    router.get('/', ctx => {
        ctx.type = 'text'
        ctx.body = 'Mock server is running'
    })

    return router.routes()
}

