const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config'),
    { setBadRequest } = require('./response'),
    { normalizePrefix } = require('../util')


module.exports = () => {
    const { urlPrefix, filePath } = Config.serveApi,
        template = fs.readFileSync(path.join(process.cwd(), filePath)).toString(),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        prefix = normalizePrefix(urlPrefix),
        router = new Router({ prefix })

    router.get('/:name/:id?', require('./get')(jsonData))
        .delete('/:name/:id?', require('./delete')(jsonData))
        .all('/:name?', handleBadRequest)
        .post('/:name?', require('./create')(jsonData))
        .put('/:name/:id?', require('./update')(jsonData, false))
        .patch('/:name/:id?', require('./update')(jsonData, true))

    return router.routes()
}


async function handleBadRequest(ctx, next) {

    if (['POST', 'PUT', 'PATCH'].includes(ctx.method)) {
        let entity = ctx.request.body,
            entityType = typeof entity

        if (!entity || entityType != 'object' || entity.isEmpty()) {
            setBadRequest(ctx)
            return
        }
    }

    return await next()
}

