const url = require('url'),
    got = require('got'),
    Config = require('../config'),
    { promisify } = require('util'),
    { normalizePrefix } = require('../util')


module.exports = () => {

    const endpoints = Config.serveProxy.endpoints
        .filter(s => s.target)
        .map(s => ({ ...s, options: s.options || {}, endpoint: normalizePrefix(s.endpoint) }))

    return async (ctx, next) => {
        let reqPath = ctx.path,
            rule = endpoints.find(s => reqPath.indexOf(s.endpoint) > -1)

        if (!rule) {
            return await next()
        }

        let { target, endpoint, options } = rule,
            restPath = reqPath.substring(endpoint.length),
            targetUrl = new URL(url.resolve(target, restPath)),
            opts = {
                method: ctx.request.method,
                headers: { ...ctx.request.headers, host: targetUrl.host }
            }
        ctx.req.body && (opts.body = ctx.req.body)
        target = target.toLocaleLowerCase()

        if (target.startsWith('http')) {
            console.log(`proxy http from ${reqPath} to ${targetUrl}`)
            await new Promise(resolve => got.stream(targetUrl, opts).pipe(ctx.res).on('close', resolve))
            // proxy.web(ctx.req, ctx.res, { ...options, target: targetUrl })
        } else if (target.startsWith('ws')) {
            // proxy.ws(ctx.req, ctx.res, { ...options, target: targetUrl })
        } else {
            ctx.status = 400
            ctx.body = {
                error: `Unsupported protocol: ${target}`
            }
        }
    }
}

