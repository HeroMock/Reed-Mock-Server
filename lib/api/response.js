

exports.setBadRequest = function (ctx) {
    ctx.status = 400
    ctx.body = { error: 'bad request' }
}

exports.setSuccess = (ctx, body) => {
    ctx.body = body || { message: 'success' }
}