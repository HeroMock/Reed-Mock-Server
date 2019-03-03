const request = require('supertest'),
    assert = require('assert')

const app = require('../index')

describe('HTTP server is working', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('index page responds 200 ', done => {
        request(server)
            .get('/')
            .expect(200, done);
    })

    it('api responds whole object', () => {
        return request(server)
            .get('/api/profile')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body.enableComment, 'boolean')
            })
    })

    it('api responds single object ', () => {
        return request(server)
            .get('/api/users/1')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body, 'object')
            })
    })

    it('api responds array', () => {
        return request(server)
            .get('/api/users/')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(res => {
                assert(typeof res.body, 'array')
            })
    })

    it('api responds 404 with json', () => {
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
