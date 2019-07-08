
const { setBadRequest } = require('./response')

module.exports = jsonData => async (ctx) => {

    let { name } = ctx.params,
        entity = ctx.request.body

    let keys = Object.keys(entity),
        isMultiKey = keys.length !== 1

    if (!name && (isMultiKey || entity.isArray())) {
        return setBadRequest(ctx)
    }

    let toAddEntity = name ? { [name]: entity } : entity,
        key = name || keys[0],
        value = toAddEntity[key],
        isValueArray = value.isArray(),
        target = jsonData[key]

    if (!target) {
        jsonData[key] = isValueArray
            ? value.map((v, i) => ({ ...v, id: v.id || i }))
            : value
    } else if (target.isArray()) {
        let startId = target.reduce((p, c) => Math.max(p, c.id), 0) + 1
        value = isValueArray ? value : [value]
        value.forEach((s, i) => s.id = startId + i)
        jsonData[key] = [...target, ...value]
    } else {
        // value = isValueArray ? value : [value]
        // value = [target, ...value]
        // value.forEach((s, i) => s.id = i)
        // jsonData[key] = value
        return setBadRequest(ctx)
    }

    ctx.status = 201
    ctx.body = { message: 'success' }
}