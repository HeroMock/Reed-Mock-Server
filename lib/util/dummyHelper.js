const { utils } = require('dummy-json')

const helpers = {
    code(length, _case) {
        const first = utils.randomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        const code = first + [...Array(length - 1)].reduce((pre) => pre + utils.randomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), '')
        return _case === 'lower' ? code.toLowerCase() : code
    }
}

module.exports = helpers