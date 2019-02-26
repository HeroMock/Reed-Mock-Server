const path = require('path'),
    Router = require('koa-router'),
    send = require('koa-send'),
    Config = require('../config'),
    createApis = require('../api')

const router = new Router(),
    allowStatic = Config.serveStatic && Config.serveStatic.enabled && Config.serveStatic.dirPath,
    allowApi = Config.serveJsonApi && Config.serveJsonApi.enabled && Config.serveJsonApi.filePath,
    allowWs = Config.serveWebsocket && Config.serveWebsocket.enabled

let staticUri, apiUri;

if (allowStatic) {
    staticUri = path.join('/', Config.serveStatic.urlPrefix, '/*')
    router.get(staticUri, serveStatic)
}

if (allowApi) {
    apiUri = path.join('/', Config.serveJsonApi.urlPrefix, '/*')
    router.use(apiUri, createApis(apiUri))
}

if (allowStatic) {
    // router.get('/*', servePage)
} else {
    router.get('/*', ctx => {
        ctx.type = 'text'
        ctx.body = 'Mock server is running'
    })
}

/**
 * @param {Router.IRouterContext} ctx
 */
async function serveStatic(ctx) {
    let filePath = ctx.path.replace(RegExp(staticUri.substring(0, staticUri.length - 2), 'i'), '')
    ctx.noHttpLog = true;
    await send(ctx, filePath, { root: Config.serveStatic.dirPath })
}

module.exports = router.routes()