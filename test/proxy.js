const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('HTTP Transparent Proxy', () => {
    let server, remoteServer

    before(() => {
        server = app.startServer()
    })

    beforeEach('start another server', () => {
        remoteServer = app.startServer(2999)
    })

    afterEach('stop remove server', () => {
        remoteServer.close()
    })

    it('1. Proxy Get', async () => {
        await request(server)
            .get('/proxy-foo/users/')
            .expect(200)
    })

    it('2. Proxy Get with query & parameter', async () => {
        const res = await request(server)
            .get('/proxy-foo/users?_page=1&_size=20')
            .expect(200)

        assert.strictEqual(res.body.length, 20)
    })


    it('3. Proxy PATCH', async () => {
        const res0 = await request(server)
            .get('/proxy-bar/api/profile')
            .expect(200)
        assert.strictEqual(undefined, res0.body.defaultTimezone)

        const res = await request(server)
            .patch('/proxy-bar/api/profile')
            .send({ defaultTimezone: 'UTC+8' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('boolean', typeof res.body.enableComment)
        assert.strictEqual('UTC+8', res.body.defaultTimezone)

        const res2 = await request(server)
            .get('/proxy-bar/api/profile')
            .expect(200)
        assert.strictEqual('UTC+8', res2.body.defaultTimezone)
    })


    after(async () => {
        await server.close()
    })
})
