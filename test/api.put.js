const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('Restful API PUT', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('PUT with empty body', () => {
        return request(server)
            .put('/api/')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('PUT with non-object body', () => {
        return request(server)
            .put('/api/whatever/')
            .send(false)
            .expect('Content-Type', /json/)
            .expect(400)
    })


    it('PUT with non-existed entity', () => {
        return request(server)
            .put('/api/users/1000')
            .send({ name: 'hans' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('PUT /api/:entity/ (plural resource) without id in body', () => {

    })

    it('PUT /api/:entity/ (single resource)', () => {

    })

    it('PUT /api/:entity/ (plural resource) with id in body', () => {

    })

    it('PUT /api/:entity/ (plural resource) with array body', () => {

    })

    it('PUT /api/:entity/:id (plural resource)', () => {

    })

    it('PUT /api/:entity/:id (single resource)', () => {

    })

    after(async () => {
        await server.close()
    })
})
