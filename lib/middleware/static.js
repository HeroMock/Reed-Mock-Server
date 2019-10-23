const static = require('reed-koa-static'),
    compose = require('koa-compose'),
    Config = require('../config')

module.exports = () => {
    let rules = Config.serveStatic.endpoints,
        mws = rules.map(s => static(s))

    return compose(mws)
}