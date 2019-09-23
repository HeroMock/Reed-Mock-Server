const { setSuccess } = require('../middleware/response')

module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    if (!name || !jsonData.hasOwnProperty(name)) {
        return await next()
    }

    if (id) {
        if (!jsonData[name].isArray()) {
            return await next()
        }
        else if (!jsonData[name].removeFirst(x => x.id == id)) {
            return await next()
        }
    } else {
        delete jsonData[name]
    }

    setSuccess(ctx)
}