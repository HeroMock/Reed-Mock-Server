const send = require('koa-send')

module.exports = prefix => async ctx => {
    let filePath = ctx.path.replace(RegExp(staticUri.substring(0, staticUri.length - 2), 'i'), '')
    ctx.noHttpLog = true;
    await send(ctx, filePath, { root: Config.serveStatic.dirPath })
}