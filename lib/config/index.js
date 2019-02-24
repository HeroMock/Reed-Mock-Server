const liveConfig = require('liveconfig')

console.log(process.cwd())

const Config = liveConfig(process.cwd())['mock-server']

module.exports = Config