const { setBadRequest, setSuccess } = require('./response')

module.exports = (jsonData, isPatch) => async (ctx, next) => {
    let { name, id } = ctx.params,
        entity = ctx.request.body,
        isEntityArray = entity.isArray()

    if (!name || !jsonData.hasOwnProperty(name)) {
        return await next()
        
    }

    if (id && isEntityArray) {
        return setBadRequest(ctx)
    }

    // single resource
    if (!jsonData[name].isArray()) {
        if (id || isEntityArray) {
            return await next()
        }

        jsonData[name] = update(jsonData[name], entity, isPatch)
        return setSuccess(ctx, jsonData[name])
    }

    let updateEntity = _entity => {
        let index = jsonData[name].findIndex(s => s.id == _entity.id)
        if (index < 0) return

        jsonData[name][index] = update(jsonData[name][index], _entity, isPatch)
        return jsonData[name][index]
    }


    if (isEntityArray) {
        let results = entity
            .filter(s => s.hasOwnProperty('id'))
            .map(s => updateEntity(s))
            .filter(s => s && s !== -1)

        results.length ? setSuccess(ctx, results) : setBadRequest(ctx)
    } else if (id || entity.hasOwnProperty('id')) {
        if (id) entity.id = id
        let result = updateEntity(entity)
        result ? setSuccess(ctx, result) : await next()
    } else {
        await next()
    }
}

function update(source, entity, isPatch) {
    return isPatch
        ? { ...source, ...entity }
        : entity
}