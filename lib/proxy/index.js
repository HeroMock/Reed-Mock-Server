const path = require('path'),
    httpProxy = require('http-proxy'),
    Config = require('../config')


module.exports = () => {

    const endpoints = Config.serveProxy.endpoints
            .filter(s => s.target)
            .map(s => ({ ...s, options: s.options || {}, endpoint: path.resolve(path.join('/', s.endpoint || '', '/')) })),
        proxy = httpProxy.createProxyServer(Config.serveProxy.options || {})

    return async (ctx, next) => {
        let reqPath = path.resolve(ctx.path),
            rule = endpoints.find(s => reqPath.indexOf(s.endpoint) > -1)

        if (!rule) {
            next()
            return
        }

        let { target, endpoint, options } = rule,
            restPath = reqPath.substring(endpoint.length),
            targetPath = path.join(target, restPath)

            
        console.log(`Proxy target: ${targetPath}`)
            
        target = target.toLocaleLowerCase()
        if (target.startsWith('http')) {
            proxy.web(ctx.req, ctx.res, { ...options, target: targetPath })
        } else if (target.startsWith('ws')) {
            proxy.ws(ctx.req, ctx.res, { ...options, target: targetPath })
        } else {
            ctx.status = 400
            ctx.body = {
                error: `Unsupported protocol: ${target}`
            }
        }
    }
}

