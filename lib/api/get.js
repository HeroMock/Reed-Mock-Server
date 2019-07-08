
module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    let { _page, _size, _sort, _order, ...ctxQuery } = ctx.query

    if (!jsonData.hasOwnProperty(name)) {
        return await next()
        
    }

    let resource = jsonData[name]

    if (!resource.isArray()) {
        return setResult(ctx, id ? {} : resource)
    }

    if (id) {
        return setResult(ctx, resource.find(x => x.id == id))
    }

    resource = customFilter(resource, ctxQuery)
    ctx.set('X-Total-Count', resource.length)

    if (_sort) {
        resource = resource.sort((a, b) => {
            let value = a[_sort] - b[_sort],
                direction = _order == 'desc' ? -1 : 1
            return value * direction
        })
    }

    if (_page) {
        _size = Number(_size) || 10
        _page = Number(_page) || 1
        resource = resource.filter((v, i) => (_page - 1) * _size <= i && i < _page * _size)
    }

    setResult(ctx, resource)
}

function setResult(ctx, result) {
    ctx.type = 'json'
    ctx.status = result ? 200 : 404
    ctx.body = result || { error: `Not Found: ${ctx.path}` }
}


function customFilter(array, query) {
    let terms = Object.entries(query || {})
    if (!terms.length) return array

    array = array.filter(obj => terms.every(t => {
        let value = accessByPath(obj, t[0])
        return value === undefined || value == t[1] || value + '' == t[1]
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