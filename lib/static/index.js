const path = require('path'),
    fs = require('fs'),
    { promisify } = require('util'),
    send = require('koa-sendfile'),
    Config = require('../config')

module.exports = () => async (ctx, next) => {
    let { urlPrefix, dirPath, indexPage } = Config.serveStatic
    urlPrefix = path.join('/', urlPrefix, '/').replace(/\/$/, '')

    let filePath = ctx.path
    if (urlPrefix) {
        filePath = filePath.replace(RegExp(`^${urlPrefix}`), '')
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