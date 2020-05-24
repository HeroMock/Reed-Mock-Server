const fs = require('fs'),
    path = require('path')

let configFile = process.env.MockConfig
const fileFullPath = configFile ? path.isAbsolute(configFile) ? configFile : path.join(process.cwd(), configFile) : ''

const Config = fs.existsSync(fileFullPath) ? JSON.parse(fs.readFileSync(fileFullPath).toString()) : {}

module.exports = Config