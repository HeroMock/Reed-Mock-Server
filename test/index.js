const request = require('supertest')

const app = require('../index')

describe('HTTP server is working', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('responds 200 ', done => {
        request(server)
            .get('/')
            .expect(200, done);
    })

    after(async () => {
        await server.close()
    })
})