
module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    let { _page, _size } = ctx.query
    if (!jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    let resource = jsonData[name]

    if (!resource.isArray()) {
        setResult(ctx, next, id ? {} : resource)
        return
    }

    if (id) {
        setResult(ctx, next, resource.find(x => x.id == id))
        return
    }

    ctx.set('X-Total-Count', resource.length)

    resource = customFilter(resource, ctx.query)

    if (_page) {
        _size = Number(_size) || 20
        _page = Number(_page) || 1
        resource = resource.filter((v, i) => (_page - 1) * _size <= i && i < _page * _size)
    }

    setResult(ctx, next, resource)
}

function setResult(ctx, next, result) {
    if (!result) next()
    else {
        ctx.response.type = 'json'
        ctx.body = result
    }
}


function customFilter(array, query) {
    let terms = Object.entries(query || {})
    if (!terms.length) return array

    array = array.filter(obj => terms.every(t => {
        let value = accessByPath(obj, t[0])
        return value === undefined || value == t[1]
    }))

    return array
}

function accessByPath(obj, path) {
    return path.split('.').reduce((result, key) =>
        result !== undefined && result.hasOwnProperty(key)
            ? result[key]
            : undefined
        , obj)
}