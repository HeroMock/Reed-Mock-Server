const url = require('url'),
    httpProxy = require('http-proxy'),
    Config = require('../config'),
    { promisify } = require('util'),
    { normalizePrefix } = require('../util')


module.exports = () => {

    const endpoints = Config.serveProxy.endpoints
        .filter(s => s.target)
        .map(s => ({ ...s, options: s.options || {}, endpoint: normalizePrefix(s.endpoint) })),
        proxy = httpProxy.createProxyServer(Config.serveProxy.options || {})

    return async (ctx, next) => {
        let reqPath = ctx.path,
            rule = endpoints.find(s => reqPath.indexOf(s.endpoint) > -1)

        if (!rule) {
            return await next()
        }

        let { target, endpoint, options } = rule,
            restPath = reqPath.substring(endpoint.length),
            targetUrl = new URL(url.resolve(target, restPath)),
            originalUrl = ctx.req.url
        ctx.req.url = new URL(targetUrl).pathname
        ctx.req.originalUrl = originalUrl
        target = target.toLocaleLowerCase()

        console.log('%s - %s %s proxy to -> %s', new Date().toISOString(), ctx.req.method, reqPath, targetUrl)

        await new Promise((resolve, reject) => {

            ctx.res.on('close', () => reject(new Error(`Http response closed while proxying ${originalUrl}`)));
            ctx.res.on('finish', resolve)

            if (target.startsWith('http')) { 
                proxy.web(ctx.req, ctx.res, { ...options, target: targetUrl }, e => {
                    const status = {
                        ECONNREFUSED: 503,
                        ETIMEOUT: 504
                    }[e.code]
                    ctx.status = status || 500
                    resolve()
                })
            } else if (target.startsWith('ws')) {
                
                // proxy.ws(ctx.req, ctx.res, { ...options, target: targetUrl })
            } else {
                ctx.status = 400
                ctx.body = {
                    error: `Unsupported protocol: ${target}`
                }
            }
        })
        
    }
}

