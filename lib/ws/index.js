// const Config = require('../config')
const Router = require('koa-router'),
    KoaWs = require('reed-koa-websocket'),
    path = require('path'),
    fs = require('fs'),
    dummyJson = require('dummy-json'),
    Config = require('../config')

const logPrefix = '[Reed Mock] [WebSocket] '

module.exports = app => {
    app.ws = new KoaWs(app)
    app.ws.use(getRouters())
}

function getRouters() {

    const { endpoints } = Config.serveWebsocket,
        router = new Router()

    endpoints.forEach(s => router.all(s.endpoint, async ctx => {

        console.log(`${logPrefix}Middleware applied for ${s.endpoint}`)

        ctx.websocket.on('message', msg => console.log(`${logPrefix}Info On message: \r\n${msg}`))

        let sendMsg = () => {
            console.log(`${logPrefix}[${new Date().format('yyyy-MM-dd hh:mm:ss.S')}] Sending message`)
            ctx.websocket.send(generateJson(s.filePath))
        }

        if (s.type == 'timer') {

            let interval = setInterval(sendMsg, Number(s.interval))
            ctx.websocket.on('close', () => clearInterval(interval))

        } else if (s.type == 'fileWatcher') {

            let file = path.join(process.cwd(), s.filePath)
            fs.watchFile(file, sendMsg)
            ctx.websocket.on('close', () => fs.unwatchFile(file, sendMsg))

        }
    }))

    return router.routes()
}

function generateJson(filePath) {
    const template = fs.readFileSync(path.join(process.cwd(), filePath)).toString(),
        jsonStr = dummyJson.parse(template)
    return jsonStr
}
