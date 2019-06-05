const request = require('supertest')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP Transparent Proxy', () => {
    let server

    before(() => {
        server = app.startServer()
    })

    it('index page responds 200 ', done => {
        request(server)
            .get('/proxy-foo')
            .expect(200, done)
    })

    after(async () => {
        await server.close()
    })
})
