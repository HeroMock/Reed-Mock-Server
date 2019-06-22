const { setSuccess } = require('./response')

module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    if (!name || !jsonData.hasOwnProperty(name)) {
        await next()
        return
    }

    if (id) {
        if (!jsonData[name].isArray()) {
            await next()
            return
        }
        else if (!jsonData[name].removeFirst(x => x.id == id)) {
            await next()
            return
        }
    } else {
        delete jsonData[name]
    }

    setSuccess(ctx)
}