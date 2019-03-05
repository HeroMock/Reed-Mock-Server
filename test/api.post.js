const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP server is working', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('POST with empty body', () => {
        return request(server)
            .post('/api/')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('POST with non-object body', () => {
        return request(server)
            .post('/api/whatever/')
            .send('hello')
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('POST /api/ with object (no single key)', () => {
        return request(server)
            .post('/api/')
            .send({ name: 'foo', value: 'bar' })
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('POST /api/ with object (single key)', () => {

    })

    it('POST /api/:name with object (no single key)', () => {

    })

    it('POST /api/ with array', () => {
        return request(server)
            .post('/api/')
            .send([1, 2, 3])
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('POST /api/:name with array', () => {

    })

    after(async () => {
        await server.close()
    })
})
