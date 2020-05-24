const request = require('supertest')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('HTTP server is working', () => {
    let server

    before(() => {
        server = app.startServer()
    })

    it('index page responds 200 ', done => {
        request(server)
            .get('/')
            .expect(200, done)
    })

    after(async () => {
        await server.close()
    })
})
