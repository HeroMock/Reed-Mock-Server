const fs = require('fs'),
    path = require('path')

let fileFullPath = toFullPath(process.env.MockConfig)
process.env.MockConfig = fileFullPath

const Config = fs.existsSync(fileFullPath) ? JSON.parse(fs.readFileSync(fileFullPath).toString()) : {}

module.exports = Config

function toFullPath(p) {
    return p ? path.isAbsolute(p) ? configFile : path.join(process.cwd(), p) : ''
}
