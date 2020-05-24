const Koa = require('koa'),
    Config = require('../config')

module.exports = (server) => {

    const portal = new Koa()

    portal.use(async ctx => {
        server.restart()
        
        ctx.body = 'server restarted'
    })

    portal.listen(Config.portal.port)
}

