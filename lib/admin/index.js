const Config = require('../config'),
    Router = require('koa-router'),
    static = require('reed-koa-static'),
    rest = require('./rest'),
    { normalizePrefix } = require('../util')

const httpPort = Number(process.env.PORT || Config.port)

module.exports = () => {

    let { urlPrefix } = Config.admin
    const router = new Router()
    router.prefix(urlPrefix)

    console.log(`admin url: http://localhost:${httpPort}${urlPrefix}/`)

    router.get('/api/config', rest.getConfig)
    router.put('/api/config', rest.setConfig)

    router.get('/api/endpoint', rest.getEndpoint)
    router.put('/api/endpoint', rest.editEndpoint)
    router.post('/api/endpoint', rest.addEndpoint)
    router.delete('/api/endpoint', rest.deleteEndpoint)

    router.use(static({ prefix: '/', dirPath: './ui/dist/reed-mock-admin' }))

    return router.routes()
}
