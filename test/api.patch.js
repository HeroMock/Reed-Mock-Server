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
        return request(server)
            .patch('/api/feedbacks')
            .send({ comment: 'great', userId: 55, timestamp: '20190707 09:23:23' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('PATCH /api/:entity/ (single resource)', async () => {
        const res = await request(server)
            .patch('/api/profile')
            .send({ defaultTimezone: 'UTC+8' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('boolean', typeof res.body.enableComment)
        assert.strictEqual('UTC+8', res.body.defaultTimezone)

        const res2 = await request(server)
            .get('/api/profile')
            .expect(200)
        assert.strictEqual('UTC+8', res2.body.defaultTimezone);
    })

    it('PATCH /api/:entity/ (plural resource) with id in body', async () => {
        const res0 = await request(server).get('/api/users/5')
        assert.notStrictEqual('Hans Huang', res0.body.name)

        const res = await request(server)
            .patch('/api/users')
            .send({ id: 5, name: 'Hans Huang' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('Hans Huang', res.body.name)

        const res2 = await request(server)
            .get('/api/users/5')
            .expect(200)
        assert.strictEqual('Hans Huang', res2.body.name)
    })

    it('PATCH /api/:entity/ (plural resource) with array body', async () => {
        const res = await request(server)
            .patch('/api/users')
            .send([{ id: 10, name: 'Hans' }, { id: 20, name: 'Huang' }])
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual(2, res.body.length)

        const res2 = await request(server)
            .get('/api/users/10')
            .expect(200)
        assert.notStrictEqual('Hans', res2.body.name)
    })

    it('PATCH /api/:entity/:id (plural resource)', async () => {
        const res = await request(server)
            .patch('/api/users/30')
            .send({ name: 'Hans Huang', job: 'coder' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('Hans Huang', res.body.name)
        assert.strictEqual('coder', res.body.job)

        const res2 = await request(server)
            .get('/api/users/5')
            .expect(200)
        assert.strictEqual('Hans Huang', res2.body.name)
        assert.strictEqual('coder', res2.body.job)
    })

    it('PATCH /api/:entity/:id (single resource)', async () => {
        return request(server)
            .patch('/api/profile/5')
            .send({ defaultTimezone: 'UTC+8' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    after(async () => {
        await server.close()
    })
})
