const http = require('http'),
    request = require('supertest'),
    assert = require('assert'),
    ws = require('ws')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP Transparent Proxy', () => {
    let server, client1, client2

    before(() => {
        server = app.startServer()
    })

    beforeEach('start another server', () => {
        client1 = new ws('ws://localhost:3000/ws1')
        client2 = new ws('ws://localhost:3000/ws2')
    })

    it('1. WS Get msg regularly', async () => {
        let count = 0
        client1.on('message', function incoming(data) {
            count++
            console.log(data)
        })

        await new Promise(resolve => setTimeout(resolve, 1100))

        assert.strictEqual(count, 2)
    })

    // it('2. WS Get by file changed', async () => {
    //     let count = 0
    //     client2.on('message', function incoming(data) {
    //         count++
    //         console.log(data)
    //     })

    // })


    after(async () => {
        await server.close()
    })
})