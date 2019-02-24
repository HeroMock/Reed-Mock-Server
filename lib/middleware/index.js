const Koa = require('koa'),
    koaBody = require('koa-body'),
    Config = require('../config'),
    router = require('../router')


/**
 * @param {Koa} app
 */
function setupMiddleware(app) {
    app.use(catchGlobalError)
        // .use(getKoaLogger('http'))
        // .use(setViewRender(path.resolve(__dirname, 'views')))
        .use(koaBody())
        .use(router)
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
    ctx.status = 404

    switch (ctx.accepts('html', 'json')) {
        // case 'html':
        //     ctx.type = 'html'
        //     await ctx.render('404', Config.renderView.data)
        //     break;
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

module.exports = setupMiddleware