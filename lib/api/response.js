

exports.setBadRequest = function (ctx) {
    ctx.status = 400
    ctx.body = { error: 'bad request' }
}