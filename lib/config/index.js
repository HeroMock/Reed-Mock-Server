const fs = require('fs'),
    { absPath } = require('../util')


process.env.MockConfig = absPath(process.env.MockConfig)

const Config = fs.existsSync(process.env.MockConfig) ? JSON.parse(fs.readFileSync(process.env.MockConfig).toString()) : {}

module.exports = Config
