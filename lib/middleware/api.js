const path = require('path'),
    Config = require('../config'),
    { normalizePrefix } = require('../util'),
    jsonApi = require('reed-json-api')


module.exports = () => {
    let { urlPrefix, filePath } = Config.serveApi

    path.isAbsolute(filePath) || (filePath = path.join(process.cwd(), filePath))
    urlPrefix = normalizePrefix(urlPrefix)

    return jsonApi({ filePath, urlPrefix })
}