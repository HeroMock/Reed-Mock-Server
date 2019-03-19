const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config'),
    { setBadRequest } = require('./response'),
    util = require('../util')


module.exports = prefix => {
    const template = fs.readFileSync(path.join(process.cwd(), Config.serveJsonApi.filePath)).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router();

    router.prefix(prefix)

    router.get('/:name/:id?', require('./get')(jsonData))
        .delete('/:name/:id?', require('./delete')(jsonData))
        .all('/:name?', handleBadRequest)
        .post('/:name?', require('./create')(jsonData))
        .put('/:name/:id?', require('./update')(jsonData))
        .patch('/:name/:id?', require('./update')(jsonData))

    return router.routes()
}


function handleBadRequest(ctx, next) {

    if (['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
        let entity = ctx.request.body,
            entityType = typeof entity

        if (!entity || entityType != 'object' || entity.isEmpty()) {
            setBadRequest(ctx)
            return
        }
    }

    next()
}

