const http = require('http'),
    assert = require('assert'),
    ws = require('ws'),
    fs = require('fs'),
    { promisify } = require('util')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('Websocket', () => {
    const port = 3456;
    let server, client1, client2

    before(() => {
        server = app.startServer(port)
    })

    beforeEach('start another server', () => {
        client1 = new ws(`ws://localhost:${port}/ws1`)
        client2 = new ws(`ws://localhost:${port}/ws2`)
    })

    it('1. WS Get msg regularly', async () => {
        let isOpened
        client1.on('open', () => {
            isOpened = true;
        })

        let count = 0
        client1.on('message', data => {
            count++
            console.log(data)
        })

        await new Promise(resolve => setTimeout(resolve, 1100))

        assert.strictEqual(isOpened, true)
        assert.strictEqual(count, 2)
    })

    it('2. WS Get by file changed', async () => {
        let isOpened
        client1.on('open', () => {
            isOpened = true;
        })

        let count = 0
        client2.on('message', data => {
            count++
            console.log(data)
        })
        await promisify(fs.utimes)('./json-ws2.hbs', Date.now(), Date.now())

        assert.strictEqual(isOpened, true)
        assert.strictEqual(count, 1)
    })


    after(async () => {
        await server.close()
    })
})