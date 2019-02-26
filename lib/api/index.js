const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config')


module.exports = prefix => {
    const template = fs.readFileSync(path.join(process.cwd(), Config.serveJsonApi.filePath)),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router();

    router.prefix(prefix)

    router.get('/:entity/:id?', getEntity(jsonData))

    return router.routes()
}

function getEntity(jsonData) {
    return async (ctx, next) => {
        let { entity, id } = ctx.params
        if (!jsonData.hasOwnProperty(entity)) {
            next()
            return
        }


    }
}