// const Config = require('../config')
const ws = require('ws'),
    compose = require('koa-compose');

module.exports = app => {


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
        console.log(`[Reed Mock] [WebSocket] Info: 'Connection received'`)

        socket.on('error', e => console.error(`[Reed Mock] [WebSocket] Error: ${e.message}`))

        let fn = compose(this.middleware)
    }
}