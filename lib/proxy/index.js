const http = require('http'),
    path = require('path'),
    net = require('net'),
    url = require('url'),
    Router = require('koa-router'),
    Config = require('../config'),
    { normalizePrefix } = require('../util')


module.exports = () => async (ctx, next) => {
    let { endpoints } = Config.serveProxy,
        rule = endpoints
            .filter(s => s.target)
            .map(s => ({ target: s.target, endpoint: path.join('/', s.endpoint || '', '/') }))
            .find(s => ctx.path.indexOf(s.endpoint) > -1)

    if (!rule) {
        next()
        return
    }

    let { target, endpoint } = rule

    ctx.status = 200
}
