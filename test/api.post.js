const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('Restful API POST', () => {
    let server

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
            .send(false)
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
        return request(server)
            .post('/api/')
            .send({ feedbacks: { comment: 'great', userId: 55, timestamp: '20190707 09:23:23' } })
            .expect('Content-Type', /json/)
            .expect(201)
            .then(() => request(server)
                .get('/api/feedbacks/500')
                .expect(200)
                .then(res => assert.equal('great', res.body.comment))
            )
    })

    it('POST /api/:name with object (no single key)', () => {
        return request(server)
            .post('/api/feedbacks')
            .send({ comment: 'great', userId: 55, timestamp: '20190707 09:23:23' })
            .expect('Content-Type', /json/)
            .expect(201)
    })

    it('POST /api/ with array', () => {
        return request(server)
            .post('/api/')
            .send([1, 2, 3])
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('POST /api/:name with array', () => {
        return request(server)
            .post('/api/feedbacks')
            .send([
                { comment: 'great', userId: 55, timestamp: '20190707 09:23:23' },
                { comment: 'like it', userId: 90, timestamp: '20191028 15:14:03' }
            ])
            .expect('Content-Type', /json/)
            .expect(201)
    })

    after(async () => {
        await server.close()
    })
})
