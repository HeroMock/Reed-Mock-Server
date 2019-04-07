
module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    let { _page, _size } = ctx.query
    if (!jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    ctx.response.type = 'json'

    let resource = jsonData[name]
    if (!resource.isArray()) {
        ctx.body = resource
    } else if (id) {
        ctx.body = resource.find(x => x.id == id)
    } else if (_page) {
        _size = Number(_size) || 20
        _page = Number(_page) || 1
        ctx.set('X-Total-Count', resource.length)
        ctx.body = resource.filter((v, i) => (_page - 1) * _size <= i && i < _page * _size)
    } else {
        ctx.body = resource
    }

    ctx.status = ctx.body ? 200 : 404
}
