

exports.setBadRequest = function (ctx) {
    ctx.status = 400
    ctx.body = { error: 'bad request' }
}

exports.setSuccess = (ctx, body) => {
    ctx.body = body || { message: 'success' }
}


/**
 * @param {Koa.Context} ctx
 * @param {Function} next
 */
exports.catchGlobalError = async (ctx, next) => {
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
exports.setNotFound = ctx => {
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

exports.setIndex = async (ctx, next) => {
    if (ctx.req.method !== 'GET' || ctx.req.url !== '/') return await next()

    ctx.status = 200
    ctx.type = 'text'
    ctx.body = 'Mock server is running'
}