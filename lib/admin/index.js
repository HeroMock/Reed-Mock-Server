const Config = require('../config'),
    static = require('reed-koa-static'),
    { normalizePrefix } = require('../util')

const httpPort = Number(process.env.PORT || Config.port)

module.exports = () => {
    let { urlPrefix } = Config.admin

    urlPrefix = normalizePrefix(urlPrefix)
    console.log(`admin url: http://localhost:${httpPort}/${urlPrefix.replace(/(^\/)|(\/$)/, '')}/`)

    return static({ urlPrefix, dirPath: './ui/dist/reed-mock-admin' })
}
