const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config')


module.exports = prefix => {
    const template = fs.readFileSync(path.join(process.cwd(), Config.serveJsonApi.filePath)).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router();

    router.prefix(prefix)

    router.get('/:name/:id?', getEntity(jsonData))

    router.post('/:name?', addEntity(jsonData))
    router.post('/:name?', setBadRequest)

    return router.routes()
}

function getEntity(jsonData) {
    return async (ctx, next) => {
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
    }
}

function addEntity(jsonData) {
    return async (ctx, next) => {
        let { name } = ctx.params,
            entity = ctx.request.body,
            entityType = typeof entity

        if (!entity || entityType != 'object' || entity.isEmpty()) {
            next()
            return
        }

        let keys = Object.keys(entity),
            isMultiKey = keys.length !== 1

        if (!name && (isMultiKey || entity.isArray())) {
            next()
            return
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
            value = isValueArray ? value : [value];
            value.forEach((s, i) => s.id = startId + i)
            jsonData[key] = [...target, ...value]
        } else {
            // value = isValueArray ? value : [value]
            // value = [target, ...value]
            // value.forEach((s, i) => s.id = i)
            // jsonData[key] = value
            next()
            return
        }

        ctx.status = 201
        ctx.body = { message: 'success' }
    }
}

function setBadRequest(ctx) {
    ctx.status = 400
    ctx.body = { error: 'bad request' }
}

Object.prototype.isEmpty = function () {
    return Object.getOwnPropertyNames(this).length == 0
}

Object.prototype.isArray = function () {
    return Array.isArray(this)
}