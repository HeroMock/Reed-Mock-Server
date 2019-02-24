const fs = require('fs'),
    path = require('path')

const configFile = fs.readFileSync(path.join(process.cwd(), 'mock-server.json')),
    Config = JSON.parse(configFile.toString())

module.exports = Config