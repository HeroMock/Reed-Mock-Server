const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('Restful API PUT', () => {
    let server

    before(() => {
        server = app.startServer()
    })

    it('1. PUT with empty body', () => {
        return request(server)
            .put('/api/')
            .send({})
            .expect('Content-Type', /json/)
            .expect(400)
    })

    it('2. PUT with non-object body', () => {
        return request(server)
            .put('/api/whatever/')
            .send(false)
            .expect('Content-Type', /json/)
            .expect(400)
    })


    it('3. PUT with non-existed entity', () => {
        return request(server)
            .put('/api/users/1000')
            .send({ name: 'hans' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('4. PUT /api/:entity/ (plural resource) without id in body', () => {
        return request(server)
            .put('/api/feedbacks')
            .send({ comment: 'great', userId: 55, timestamp: '20190707 09:23:23' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('5. PUT /api/:entity/ (single resource)', async () => {
        const res = await request(server)
            .put('/api/profile')
            .send({ defaultTimezone: 'UTC+8' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('undefined', typeof res.body.enableComment)
        assert.strictEqual('UTC+8', res.body.defaultTimezone)

        const res2 = await request(server)
            .get('/api/profile')
            .expect(200)
        assert.strictEqual('UTC+8', res2.body.defaultTimezone)
    })

    it('6. PUT /api/:entity/ (plural resource) with id in body', async () => {
        const res0 = await request(server).get('/api/users/5')
        assert.notStrictEqual('Hans Huang', res0.body.name)
        assert.strictEqual('string', typeof res0.body.email)

        const res = await request(server)
            .put('/api/users')
            .send({ id: 5, name: 'Hans Huang', company: 'xxxxx' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('Hans Huang', res.body.name)
        assert.strictEqual('xxxxx', res.body.company)
        assert.strictEqual('undefined', typeof res.body.email)

        const res2 = await request(server)
            .get('/api/users/5')
            .expect(200)
        assert.strictEqual('Hans Huang', res2.body.name)
    })

    it('7. PUT /api/:entity/ (plural resource) with array body', async () => {
        const res = await request(server)
            .put('/api/users')
            .send([{ id: 10, name: 'Hans' }, { id: 20, name: 'Huang' }])
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual(2, res.body.length)

        const res2 = await request(server)
            .get('/api/users/20')
            .expect(200)
        assert.strictEqual('Huang', res2.body.name)
    })

    it('8. PUT /api/:entity/:id (plural resource)', async () => {
        const res = await request(server)
            .put('/api/users/30')
            .send({ name: 'Hans Huang', job: 'coder' })
            .expect('Content-Type', /json/)
            .expect(200)
        assert.strictEqual('Hans Huang', res.body.name)
        assert.strictEqual('coder', res.body.job)

        const res2 = await request(server)
            .get('/api/users/30')
            .expect(200)
        assert.strictEqual('Hans Huang', res2.body.name)
        assert.strictEqual('coder', res2.body.job)
        assert.strictEqual('undefined', typeof res.body.email)
    })

    it('9. PUT /api/:entity/:id (single resource)', () => {
        return request(server)
            .put('/api/profile/5')
            .send({ defaultTimezone: 'UTC+8' })
            .expect('Content-Type', /json/)
            .expect(404)
    })

    after(async () => {
        await server.close()
    })
})
