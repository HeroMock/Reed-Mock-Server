const koaBody = require('koa-body'),
    router = require('../router')


/**
 * @param {Koa} app
 */
function setupMiddleware(app) {
    app.use(catchGlobalError)
        // .use(getKoaLogger('http'))
        .use(koaBody())
        .use(router())
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

    switch (ctx.accepts('json', 'html', 'text')) {
        case 'html':
            ctx.type = 'html'
            ctx.body = 'Page Not Found'
            break
        case 'json':
            ctx.body = {
                error: 'resource not found'
            }
            break
        case 'text':
            ctx.type = 'text'
            ctx.body = 'Page Not Found'
            break
        default:
            ctx.body = {
                error: 'resource not found'
            }
    }
}

module.exports = setupMiddleware