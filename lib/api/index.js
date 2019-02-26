const fs = require('fs'),
    path = require('path'),
    Router = require('koa-router'),
    dummyJson = require('dummy-json'),
    Config = require('../config')


function createApis(prefix) {
    const template = fs.readFileSync(path.join(process.cwd(), Config.serveJsonApi.filePath)),
        jsonResult = dummyJson.parse(template),
        jsonData = JSON.parse(jsonResult),
        router = new Router();
    router.prefix(prefix)

    

    return router.routes()
}

module.exports = createApis

