const { setBadRequest, setSuccess } = require('./response')

module.exports = (jsonData, isPatch) => async (ctx, next) => {
    let { name, id } = ctx.params,
        entity = ctx.request.body,
        isEntityArray = entity.isArray()

    if (!name || !jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    if (!jsonData[name].isArray()) {
        if (id || isEntityArray) {
            next()
            return
        }

        jsonData[name] = update(jsonData[name], entity, isPatch)
        setSuccess(ctx, jsonData[name])
        return
    }

    if (id) {
        let index = jsonData[name].findIndex(s => s.id == id)
        if (index < 0) {
            next()
            return
        }
        if (isEntityArray) {
            setBadRequest(ctx)
            return
        }

        delete entity.id
        jsonData[name][index] = update(jsonData[name][index], entity, isPatch)
        jsonData[name][index].id = id
        setSuccess(ctx, jsonData[name][index])
        return
    }


    next()
}



function update(source, entity, isPatch) {
    return isPatch
        ? { ...source, ...entity }
        : entity
}