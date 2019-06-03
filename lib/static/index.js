const path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    send = require('koa-sendfile'),
    Router = require('koa-router'),
    Config = require('../config'),
    { normalizePrefix } = require('../util')

module.exports = () => {
    let prefix = normalizePrefix(Config.serveStatic.urlPrefix),
        router = new Router({ prefix })

    router.get('/*', serveStatic(prefix))
    return router.routes()
}

function serveStatic(prefix) {
    return async (ctx, next) => {
        let { dirPath, indexPage } = Config.serveStatic

        let filePath = ctx.path
        if (prefix) {
            filePath = filePath.replace(RegExp(`^${prefix}`), '')
        }

        let fullPath = path.join(process.cwd(), dirPath, filePath),
            stats = await promisify(fs.stat)(fullPath).then(stats => stats, err => null)

        if (stats && stats.isFile()) {

            await send(ctx, fullPath)

        } else if (stats && stats.isDirectory()) {

            indexPage = [...(indexPage || []), 'index.html', 'index.htm']
            let indexPaths = indexPage.map(s => path.join(fullPath, s)),
                indexFile = indexPaths.find(async s => {
                    let indexStats = await promisify(fs.stat)(s)
                    return indexStats && indexStats.isFile()
                })
            indexFile ? await send(ctx, indexFile) : next()

        } else {

            next()

        }

        // await send(ctx, fullPath).then(stats => {
        //     if (!stats || !stats.isFile()) {
        //         console.error(`Not existed or not a file: ${fullPath}`)
        //         next()
        //     }
        // })
    }
}
