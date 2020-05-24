const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('Static HTTP Server', () => {
    let server

    beforeEach(() => {
        server = app.startServer()
    })

    it('1. Request index page', async () => {
        const res = await request(server)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)
    })

    it('2. Request non-html file', async () => {
        const res = await request(server)
            .get('/app.js')
            .expect('Content-Type', /javascript/)
            .expect(200)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)
    })

    it('2. Request non-existed file', async () => {
        const res = await request(server)
            .get('/no-existed.js')
            .expect(404)

        assert.strictEqual(Number(res.header['content-length']) > 0, true)
    })

    afterEach(async () => {
        await server.close()
    })
})
