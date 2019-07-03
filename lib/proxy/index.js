const path = require('path'),
    http = require('http'),
    httpProxy = require('http-proxy'),
    url = require('url'),
    Config = require('../config'),
    { promisify } = require('util')


module.exports = () => {

    const endpoints = Config.serveProxy.endpoints
            .filter(s => s.target)
            .map(s => ({ ...s, options: s.options || {}, endpoint: path.resolve(path.join('/', s.endpoint || '', '/')) })),
        proxy = httpProxy.createProxyServer(Config.serveProxy.options || {})

    return async (ctx, next) => {
        let reqPath = path.resolve(ctx.path),
            rule = endpoints.find(s => reqPath.indexOf(s.endpoint) > -1)

        if (!rule) {
            await next()
            return
        }

        let { target, endpoint, options } = rule,
            restPath = reqPath.substring(endpoint.length),
            targetUrl = new URL(url.resolve(target, restPath)),
            opts = {
                method: ctx.req.method,
                headers: { ...ctx.req.headers, host: targetUrl.host }
            }

        target = target.toLocaleLowerCase()
        if (target.startsWith('http')) {
            // console.log('proxy http')
            // await new Promise(resolve => {
            //     console.log(`make request: ${targetUrl}`)
            //     http.request(targetUrl, opts, res => {
            //         console.log('piping...')

            //         res.pipe(ctx.res)
            //         res.once('end', () => {
            //             ctx.status = res.statusCode
            //             console.log('ended')
            //             resolve()
            //         })
            //     })
            // })
            // console.log('done')
            // proxy.web(ctx.req, ctx.res, { ...options, target: targetUrl })
        } else if (target.startsWith('ws')) {
            proxy.ws(ctx.req, ctx.res, { ...options, target: targetUrl })
        } else {
            ctx.status = 400
            ctx.body = {
                error: `Unsupported protocol: ${target}`
            }
        }
    }
}

