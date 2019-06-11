const http = require('http'),
    request = require('supertest')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP Transparent Proxy', () => {
    let server, remoteServer, remoteReq

    before(() => {
        server = app.startServer()
    })

    beforeEach('start another server', () => {
        remoteReq = new Promise(resolve => {
            remoteServer = http.createServer((req, res) => {
                res.writeHead(200, { 'Content-Type': 'text/plain' })
                res.write('request successfully proxied!' + '\n' + JSON.stringify(req.headers, true, 2))
                res.end()
                resolve(req)
            }).listen(4000)
        })
    })

    afterEach('stop remove server', () => {
        remoteServer.close()
    })

    it('Proxy Get', done => {
        request(server)
            .get('/proxy-foo/')
            .expect(200, done)
    })

    after(async () => {
        await server.close()
    })
})
