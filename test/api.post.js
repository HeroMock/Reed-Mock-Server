const request = require('supertest'),
    assert = require('assert')

process.env.NODE_ENV = 'test'

const app = require('../index')

describe('HTTP server is working', () => {
    let server;

    before(() => {
        server = app.startServer()
    })

    it('POST /api/ with empty body', () => {

    })

    it('POST /api/ with object (no single key)', () => {

    })

    it('POST /api/ with object (single key)', () => {

    })

    it('POST /api/:name with object (no single key)', () => {

    })

    after(async () => {
        await server.close()
    })
})
