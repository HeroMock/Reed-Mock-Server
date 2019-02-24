const path = require('path'),
    Router = require('koa-router'),
    send = require('koa-send'),
    Config = require('../config')

const router = new Router(),
    allowStatic = Config.serveStatic && Config.serveStatic.enabled && Config.serveStatic.path,
    staticUri = path.join('/', Config.serveStatic.urlPrefix, '/*')

if (allowStatic) {
    router.get(staticUri, serveStatic)
}

router.get('/favicon.ico', serveFavicon)
    .get('/public/*', serveStatic)
    .use('/api/*', api.routes())

router.get('/*', servePage)

export default router.routes()

/**
 * @param {Router.IRouterContext} ctx
 */
async function serveStatic(ctx) {
    let filePath = ctx.path.replace(RegExp(staticUri.substring(0, staticUri.length - 2), 'i'), '')
    ctx.noHttpLog = true;
    await send(ctx, filePath, { root: Config.serveStatic.path })
}

/**
 * @param {Router.IRouterContext} ctx
 */
async function renderPage(ctx) {
    let data = {
        ...Config.App,
        initialContent: '',
        initialState: '{}'
    }
    await ctx.render('index', data)
}