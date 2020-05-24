const path = require('path'),
    Config = require('../config'),
    compose = require('koa-compose'),
    { normalizePrefix } = require('../util'),
    jsonApi = require('reed-json-api')

module.exports = () => {

    const rules = Config.serveApi.endpoints,
        mws = rules.map(({ endpoint, filePath, options }) => {
            path.isAbsolute(filePath) || (filePath = path.join(process.cwd(), filePath))
            endpoint = normalizePrefix(endpoint)

            return jsonApi({ urlPrefix: endpoint, filePath, options })
        })

    return compose(mws)
}