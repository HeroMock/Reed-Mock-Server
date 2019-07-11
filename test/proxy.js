const http = require('http'),
    request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP Transparent Proxy', () => {
    let server, remoteServer, remoteReq

    before(() => {
        server = app.startServer()
    })

    // beforeEach('start another server', () => {
    //     remoteReq = new Promise(resolve => {
    //         remoteServer = http.createServer((req, res) => {
    //             res.writeHead(200, { 'Content-Type': 'text/plain' })
    //             res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2))
    //             res.end()
    //             resolve(req)
    //         }).listen(4000)
    //     })
    // })

    // afterEach('stop remove server', () => {
    //     remoteServer.close()
    // })

    it('Proxy Get', async () => {
        await request(server)
            .get('/proxy-get/')
            .expect(200)
    })

    it('Proxy Get with query', async () => {
        const res =  await request(server)
            .get('/proxy-get?foo=bar')
            .expect(200)
        
        assert.strictEqual(res.body.args.foo, 'bar')
    })

    after(async () => {
        await server.close()
    })
})
