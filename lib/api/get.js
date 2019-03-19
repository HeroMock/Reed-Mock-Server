
module.exports = jsonData => async (ctx, next) => {
    let { name, id } = ctx.params
    if (!jsonData.hasOwnProperty(name)) {
        next()
        return
    }

    ctx.response.type = 'json'
    let entityObj = jsonData[name]
    ctx.body = id && Array.isArray(entityObj)
        ? entityObj.find(x => x.id == id)
        : entityObj;
    ctx.status = ctx.body ? 200 : 404
}
