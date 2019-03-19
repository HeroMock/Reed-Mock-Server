const { setBadRequest } = require('./response')

module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    if (!name || !jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    if (id) {
        if (!jsonData[name].isArray()) {
            next()
            return
        }
        else if (!jsonData[name].removeFirst(x => x.id == id)) {
            next()
            return
        }
    } else {
        delete jsonData[name]
    }

    setSuccess(ctx)
}

function setSuccess(ctx) {
    ctx.status = 200
    ctx.body = { message: 'success' }
}