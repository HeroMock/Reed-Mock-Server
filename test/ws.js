const assert = require('assert'),
    ws = require('ws')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('Websocket', () => {
    const port = 3456
    let server

    before(() => {
        server = app.startServer(port)
    })

    beforeEach('start another server', () => {
    })

    it('1. WS Get msg regularly', async () => {
        let isOpened,
            client1 = new ws(`ws://localhost:${port}/ws1`)

        client1.on('open', () => {
            isOpened = true
        })

        let count = 0
        client1.on('message', data => {
            count++
            // console.log(data)
        })

        await new Promise(resolve => setTimeout(resolve, 1100))

        assert.strictEqual(isOpened, true)
        assert.strictEqual(count, 2)

        client1.close()
    })

    it('2. WS Get by file changed', async () => {
        let isOpened,
            client2 = new ws(`ws://localhost:${port}/ws2`)

        client2.on('open', () => {
            isOpened = true
        })

        // let count = 0
        // client2.on('message', data => {
        //     count++
        // })
        // await new Promise(resolve => fs.utimes('./json-ws2.hbs', new Date(), new Date(), () => setTimeout(resolve, 5000)))
        
        await new Promise(resolve => setTimeout(resolve, 50))
        assert.strictEqual(isOpened, true)
        // assert.strictEqual(count, 1)

        client2.close()
    })


    after(async () => {
        await server.close()
    })
})