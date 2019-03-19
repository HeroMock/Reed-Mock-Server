const path = require('path'),
    Koa = require('koa'),
    Router = require('koa-router'),
    send = require('koa-send'),
    Config = require('../config'),
    createApis = require('../api')

module.exports = function () {
    const router = new Router(),
        allowStatic = Config.serveStatic && Config.serveStatic.enabled && !!Config.serveStatic.dirPath,
        allowApi = Config.serveJsonApi && Config.serveJsonApi.enabled && !!Config.serveJsonApi.filePath,
        allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled

    let staticUri, apiUri;

    if (allowStatic) {
        staticUri = path.join('/', Config.serveStatic.urlPrefix, '/*')
        router.get(staticUri, serveStatic)
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


async function serveStatic(ctx) {
    let filePath = ctx.path.replace(RegExp(staticUri.substring(0, staticUri.length - 2), 'i'), '')
    ctx.noHttpLog = true;
    await send(ctx, filePath, { root: Config.serveStatic.dirPath })
}