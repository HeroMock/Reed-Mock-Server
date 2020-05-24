const request = require('supertest')

process.env.NODE_ENV = 'test'
process.env.EnablePortal = ''

const app = require('../index')

describe('Restful API DELETE', () => {
    let server

    beforeEach(() => {
        server = app.startServer()
    })

    it('1. DELETE with non-existed entity', () => {
        return request(server)
            .delete('/api/some-entity')
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('2. DELETE with non-existed ID', () => {
        return request(server)
            .delete('/api/users/1000')
            .expect('Content-Type', /json/)
            .expect(404)
    })

    it('3. DELETE /api/:entity/', async () => {
        await request(server)
            .delete('/api/profile')
            .expect('Content-Type', /json/)
            .expect(200)
        return await request(server)
            .get('/api/profile')
            .expect(404)
    })

    it('4. DELETE /api/:entity/:id', async () => {
        await request(server)
            .delete('/api/users/1')
            .expect('Content-Type', /json/)
            .expect(200)
        return await request(server)
            .get('/api/users/1')
            .expect(404)
    })

    it('5. DELETE /api/:entity?id=1,2,3', async () => {
        await request(server)
            .delete('/api/feedbacks?id=1,2,3')
            .expect('Content-Type', /json/)
            .expect(200)
        return await request(server)
            .get('/api/feedbacks/1')
            .expect(404)
    })

    afterEach(async () => {
        await server.close()
    })
})
