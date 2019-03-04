const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('API Get', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('GET /api/:name responds single object', () => {
        return request(server)
            .get('/api/profile')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body.enableComment, 'boolean')
            })
    })

    it('GET /api/:name/:id', () => {
        return request(server)
            .get('/api/users/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body, 'object')
            })
    })

    it('GET /api/:name responds array', () => {
        return request(server)
            .get('/api/users/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body, 'array')
            })
    })

    it('GET /api/:name responds 404 with json', () => {
        return request(server)
            .get('/api/no_existed/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
    })

    after(async () => {
        await server.close()
    })
})
