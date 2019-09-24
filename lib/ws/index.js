// const Config = require('../config')
const ws = require('ws'),
    compose = require('koa-compose'),
    Router = require('koa-router'),
    path = require('path'),
    url = require('url'),
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

    endpoints.forEach(s => router.use(s.endpoint, async ctx => {

        console.log(`${logPrefix}Middleware applied for ${s.endpoint}`)

        ctx.websocket.on('message', msg => console.log(`${logPrefix}Info On message: \r\n${msg}`))

        let sendMsg = () => {
            console.log(`${logPrefix}[${new Date().format('yyyy-MM-dd hh:mm:ss.S')}] Sending message`)
            ctx.websocket.send(generateJson(s.filePath))
        }

        if (s.type == 'timer') {
            setInterval(sendMsg, Number(s.interval))
        } else if (s.type == 'fileWatcher') {
            fs.watchFile(path.join(process.cwd(), s.filePath), sendMsg)
        }
    }))

    return router.routes()
}

function generateJson(filePath) {
    const template = fs.readFileSync(path.join(process.cwd(), filePath)).toString(),
        jsonStr = dummyJson.parse(template)
    return jsonStr
}


class KoaWs {
    constructor(app, wsOptions) {
        this.app = app

        this.middleware = []

        this.wsServer = new ws.Server({ ...wsOptions, noServer: true });
        this.wsServer.on('connection', (...s) => this._onConnection(...s))

        this._wrapListen(app)
    }

    use(fn) {
        this.middleware.push(fn)
        return this
    }

    _wrapListen(app) {
        const oldListen = app.listen

        app.listen = (...args) => {

            app.server = oldListen.apply(app, args)
            app.server.on('upgrade', (...s) => this._onUpgrade(...s))
            app.server.on('close', () => this.wsServer.close())

            return app.server
        }
    }

    _onUpgrade(request, socket, head) {
        this.wsServer.handleUpgrade(request, socket, head, ws => {
            this.wsServer.emit('connection', ws, request)
        })
    }

    _onConnection(ws, request) {
        console.log(`${logPrefix}Info: Connection received: ${request.url}`)

        ws.on('error', e => console.error(`${logPrefix}On Connection Error: ${e.message}`))

        const fn = compose(this.middleware),
            context = {
                ...this.app.createContext(request),
                websocket: ws,
                path: url.parse(request.url).pathname
            }

        fn(context)
            .catch(e => console.error(`${logPrefix}Middleware Chain Error: ${e.message}`))
    }
}