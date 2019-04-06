const { setBadRequest, setSuccess } = require('./response')

module.exports = (jsonData, isPatch) => async (ctx, next) => {
    let { name, id } = ctx.params,
        entity = ctx.request.body,
        isEntityArray = entity.isArray()

    if (id && isEntityArray) {
        setBadRequest(ctx)
        return
    }

    if (!name || !jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    // single resource
    if (!jsonData[name].isArray()) {
        if (id || isEntityArray) {
            next()
            return
        }

        jsonData[name] = update(jsonData[name], entity, isPatch)
        setSuccess(ctx, jsonData[name])
        return
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
        result ? setSuccess(ctx, result) : next()
    } else {
        next()
    }
}

function update(source, entity, isPatch) {
    return isPatch
        ? { ...source, ...entity }
        : entity
}