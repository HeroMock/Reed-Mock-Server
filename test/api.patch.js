const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('Restful API PATCH', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('PATCH with empty body', () => {
        return request(server)
            .patch('/api/')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('PATCH with non-object body', () => {
        return request(server)
            .patch('/api/whatever/')
            .send(false)
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('PATCH with non-existed entity', () => {
        return request(server)
            .patch('/api/users/1000')
            .send({ name: 'hans' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('PATCH /api/:entity/ (plural resource) without id in body', () => {

    })

    it('PATCH /api/:entity/ (single resource)', () => {

    })

    it('PATCH /api/:entity/ (plural resource) with id in body', () => {

    })

    it('PATCH /api/:entity/ (plural resource) with array body', () => {

    })

    it('PATCH /api/:entity/:id (plural resource)', () => {

    })

    it('PATCH /api/:entity/:id (single resource)', () => {

    })

    after(async () => {
        await server.close()
    })
})
