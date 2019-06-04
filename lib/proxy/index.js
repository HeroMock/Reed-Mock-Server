const http = require('http'),
    path = require('path'),
    net = require('net'),
    url = require('url'),
    Router = require('koa-router'),
    httpProxy = require('http-proxy'),
    Config = require('../config')

var proxy = httpProxy.createProxyServer({})

module.exports = () => async (ctx, next) => {
    let reqPath = path.resolve(ctx.path),
        { endpoints } = Config.serveProxy,
        rule = endpoints
            .filter(s => s.target)
            .map(s => ({ target: s.target, endpoint: path.resolve(path.join('/', s.endpoint || '', '/')) }))
            .find(s => reqPath.indexOf(s.endpoint) > -1)

    if (!rule) {
        next()
        return
    }

    let { target, endpoint } = rule,
        restPath = reqPath.substring(endpoint.length),
        targetPath = path.join(target, restPath)

    target = target.toLocaleLowerCase()

    console.log(`Proxy: ${target}`)

    if (target.startsWith('http')) {
        proxy.web(ctx.req, ctx.res, { target: targetPath })
    } else if (target.startsWith('ws')) {
        proxy.ws(ctx.req, ctx.res, { target: targetPath })
    } else {
        next()
    }
}

