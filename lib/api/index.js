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
            entity = ctx.body,
            entityType = typeof entity
        if (!entity || !['object', 'array'].includes(entityType)) {
            next()
            return
        }


    }
}
