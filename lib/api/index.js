const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config'),
    { setBadRequest } = require('./response'),
    getEntity = require('./get'),
    createEntity = require('./create'),
    updateEntity = require('./update'),
    util = require('../util')


module.exports = prefix => {
    const template = fs.readFileSync(path.join(process.cwd(), Config.serveJsonApi.filePath)).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router();

    router.prefix(prefix)

    router.get('/:name/:id?', getEntity(jsonData))
        .all('/:name?', handleBadRequest)
        .post('/:name?', createEntity(jsonData))
        .put('/:name?/:id?', updateEntity(jsonData))
        .patch('/:name?/:id?', updateEntity(jsonData))

    return router.routes()
}


function handleBadRequest(ctx, next) {
    let { id } = ctx.params
    if (['POST', 'PUT', 'PATCH'].includes(ctx.method) ||
        (ctx.method === 'DELETE' && !id)) {
        let entity = ctx.request.body,
            entityType = typeof entity

        if (!entity || entityType != 'object' || entity.isEmpty()) {
            setBadRequest(ctx)
            return
        }
    }

    next()
}

