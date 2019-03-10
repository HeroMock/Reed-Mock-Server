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

    // it('PUT /api/ with object (no single key)', () => {
    //     return request(server)
    //         .put('/api/')
    //         .send({ name: 'foo', value: 'bar' })
    //         .expect('Content-Type', /json/)
    //         .expect(400)
    // })

    // it('PUT /api/ with object (single key)', () => {
    //     return request(server)
    //         .put('/api/')
    //         .send({ feedbacks: { comment: 'great', userId: 55, timestamp: '20190707 09:23:23' } })
    //         .expect('Content-Type', /json/)
    //         .expect(201)
    //         .then(() => request(server)
    //             .get('/api/feedbacks/499')
    //             .expect(200)
    //             .then(res => assert.equal('great', res.body.comment))
    //         )
    // })

    // it('PUT /api/:name with object (no single key)', () => {
    //     return request(server)
    //         .put('/api/feedbacks')
    //         .send({ comment: 'great', userId: 55, timestamp: '20190707 09:23:23' })
    //         .expect('Content-Type', /json/)
    //         .expect(201)
    // })

    // it('PUT /api/ with array', () => {
    //     return request(server)
    //         .put('/api/')
    //         .send([1, 2, 3])
    //         .expect('Content-Type', /json/)
    //         .expect(400)
    // })

    // it('PUT /api/:name with array', () => {
    //     return request(server)
    //         .put('/api/feedbacks')
    //         .send([
    //             { comment: 'great', userId: 55, timestamp: '20190707 09:23:23' },
    //             { comment: 'like it', userId: 90, timestamp: '20191028 15:14:03' }
    //         ])
    //         .expect('Content-Type', /json/)
    //         .expect(201)
    // })

    after(async () => {
        await server.close()
    })
})
