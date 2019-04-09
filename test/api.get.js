const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('Restful API GET', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('1. GET /api/:name responds single object', () => {
        return request(server)
            .get('/api/profile')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.strictEqual(typeof res.body.enableComment, 'boolean')
            })
    })

    it('2. GET /api/:name/:id', () => {
        return request(server)
            .get('/api/users/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.strictEqual(typeof res.body, 'object')
            })
    })

    it('3. GET /api/:name responds array', () => {
        return request(server)
            .get('/api/users/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert.strictEqual(res.body.length, 100)
            })
    })

    it('4. GET /api/:name responds 404 with json', () => {
        return request(server)
            .get('/api/no_existed/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('5. GET /api/:name with filter', async () => {
        const res = await request(server)
            .get('/api/users?optedin=true&name.length=12')
            .expect('Content-Type', /json/)
            .expect(200)

        assert.strictEqual(res.body.filter(s => !s.optedin).length, 0)
        assert.strictEqual(res.body.filter(s => s.name.length == 12).length, res.body.length)
    })

    it('6. GET /api/:name with pagination', async () => {
        const res = await request(server)
            .get('/api/users?_page=1&_size=20')
            .expect('Content-Type', /json/)
            .expect(200);

        assert.strictEqual(res.body.length, 20)
        assert.strictEqual(res.body[5].id, 5)
        assert.strictEqual(Number(res.get('X-Total-Count')), 100)
    })

    before(async () => {
        await server.close()
    })
})
