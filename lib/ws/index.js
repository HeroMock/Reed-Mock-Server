// const Config = require('../config')
const ws = require('ws'),
    compose = require('koa-compose'),
    Router = require('koa-router'),
    url = require('url'),
    fs = require('fs'),
    Config = require('../config')

const logPrefix = '[Reed Mock] [WebSocket] '

module.exports = app => {
    app.ws = new KoaWs(app)
    app.ws.use(getRouters())
}

function getRouters() {
    const { endpoints } = Config.serveProxy,
        router = new Router()

    endpoints.forEach(s => router.use(s.endpoint, ctx => {

        ctx.websocket.on('message', msg => console.log(`${logPrefix}Info On message: \r\n${msg}`))

        if (s.type == 'timer') {

            setInterval(() => {
                ctx.websocket.send(generateJson(s.filePath))
            }, Number(s.interval))

        } else if (s.type == 'fileWatcher') {
            fs.watchFile(path.join(process.cwd(), s.filePath), () => {
                generateJson(s.path)
            })
        }
    }))

    return router.routes()
}

function generateJson(filePath) {
    const template = fs.readFileSync(path.join(process.cwd(), s.filePath)).toString(),
        jsonStr = dummyJson.parse(template)
    return jsonStr
}


class KoaWs {
    constructor(app, wsOptions) {
        this.app = app

        this.middleware = []
        this.wsServer = new ws.Server({ ...wsOptions, noServer: true });

        this.app.on('upgrade', this._onUpgrade)
        this.wsServer.on('connection', this._onConnection)
    }

    use(fn) {
        this.middleware.push(fn)
        return this
    }


    _onUpgrade(request, socket, head) {
        this.wsServer.handleUpgrade(request, socket, head, ws => {
            this.wsServer.emit('connection', ws, request)
        })
    }

    _onConnection(ws, request) {
        console.log(`${logPrefix}Info: Connection received`)

        socket.on('error', e => console.error(`${logPrefix}On Connection Error: ${e.message}`))

        const fn = compose(this.middleware),
            context = { ...this.app.createContext(request), websocket: ws, path: url.parse(req.url).pathname }

        fn(context).catch(e => console.error(`${logPrefix}Middleware Chain Error: ${e.message}`))
    }
}