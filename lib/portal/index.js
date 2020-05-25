const Koa = require('koa'),
    koaBody = require('koa-body'),
    Config = require('../config'),
    Router = require('koa-router'),
    static = require('reed-koa-static'),
    api = require('./api')

module.exports = () => {

    const portal = new Koa()
    portal.use(koaBody())
    const router = new Router()

    router.use(async (ctx, next) => {
        await next()
        if (['post', 'put', 'delete', 'patch'].includes(ctx.method.toLowerCase())) {
            portal.emit('restart-mock')
        }
    })

    router.get('/api/config', api.getConfig)
    router.put('/api/config', api.setConfig)

    router.get('/api/endpoint', api.getEndpoint)
    router.put('/api/endpoint', api.editEndpoint)
    router.post('/api/endpoint', api.addEndpoint)
    router.delete('/api/endpoint', api.deleteEndpoint)

    router.use(static({ dirPath: './ui/dist/reed-mock-admin' }))

    portal.use(router.routes())
    portal.listen(Config.portal.port)
    console.log(`[Reed Mock] portal url: http://localhost:${Config.portal.port}/`)

    return portal
}

