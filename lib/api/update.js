const { setBadRequest } = require('./response')

module.exports = jsonData => async (ctx, next) => {
    next()
}