const url = require('url'),
    { URL } = url,
    httpProxy = require('http-proxy'),
    Config = require('../config'),
    { normalizePrefix } = require('../util')


module.exports = () => {

    const endpoints = Config.serveProxy.endpoints
            .filter(s => s.target)
            .map(s => ({ ...s, options: s.options || {}, endpoint: normalizePrefix(s.endpoint) })),
        proxy = httpProxy.createProxyServer(Config.serveProxy.options || {})

    return async (ctx, next) => {
        let originalUrl = ctx.req.url,
            rule = endpoints.find(s => originalUrl.indexOf(s.endpoint) > -1)

        if (!rule) {
            return await next()
        }

        let { target, endpoint, options } = rule,
            restPath = originalUrl.substring(endpoint.length),
            targetUrl = new URL(target + restPath)
        ctx.req.url = url.resolve(targetUrl.pathname, targetUrl.search)
        ctx.header.host = targetUrl.host
        // ctx.req.originalUrl = originalUrl
        // target = target.toLocaleLowerCase()

        console.log(`[Reed Mock] [HTTP Proxy] ${new Date().toISOString()} - ${ctx.req.method} ${originalUrl} -> ${targetUrl}`)

        await new Promise((resolve, reject) => {

            ctx.res.on('close', () => reject(new Error(`[Reed Mock] [HTTP Proxy] Http response closed while proxying ${originalUrl}`)))
            ctx.res.on('finish', resolve)

            proxy.web(ctx.req, ctx.res, { ...options, target: targetUrl.origin }, e => {
                const status = {
                    ECONNREFUSED: 503,
                    ETIMEOUT: 504
                }[e.code]
                ctx.status = status || 500
                console.error(`[Reed Mock] [HTTP Proxy] Error: ${e.message}`)
                resolve()
            })
        })

    }
}

