const path = require('path'),
    Koa = require('koa'),
    Router = require('koa-router'),
    Config = require('../config'),
    createApis = require('../api'),
    serveStatic = require('../static')

module.exports = function () {
    const router = new Router(),
        allowStatic = Config.serveStatic && Config.serveStatic.enabled && !!Config.serveStatic.dirPath,
        allowApi = Config.serveJsonApi && Config.serveJsonApi.enabled && !!Config.serveJsonApi.filePath,
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled

    if (allowStatic) {
        router.get('/*', serveStatic())
    }

    if (allowApi) {
        router.use(createApis(Config.serveJsonApi.urlPrefix))
    }

    if (allowStatic) {
        // router.get('/*', servePage)
    } else {
        router.get('/', ctx => {
            ctx.type = 'text'
            ctx.body = 'Mock server is running'
        })
    }

    return router.routes()
}

