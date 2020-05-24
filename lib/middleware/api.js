const path = require('path'),
    Config = require('../config'),
    compose = require('koa-compose'),
    { normalizePrefix } = require('../util'),
    jsonApi = require('reed-json-api')


module.exports = () => {

    const rules = Config.serveApi.endpoints,
        mws = rules.map(({ urlPrefix, filePath, options }) => {
            path.isAbsolute(filePath) || (filePath = path.join(process.cwd(), filePath))
            urlPrefix = normalizePrefix(urlPrefix)
            console.log({ filePath, urlPrefix, options })

            return jsonApi({ filePath, urlPrefix, options })
        })

    return compose(mws)
}