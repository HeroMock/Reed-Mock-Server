const fs = require('fs'),
    { promisify } = require('util'),
    path = require('path')

let configFile = process.env.MockConfig,
    configPath = path.isAbsolute(configFile) ? configFile : path.join(process.cwd(), configFile)

const rootPath = path.dirname(configFile)

exports.getConfig = async (ctx, next) => {
    let fileData = await promisify(fs.readFile)(configPath)
    ctx.body = fileData
}

/** 
 * @requires request.body ,used to overwrite the mock-server.json
 */
exports.setConfig = async (ctx, next) => {
    let newConfig = ctx.request.body
    await promisify(fs.writeFile)(configPath, JSON.stringify(newConfig, null, 2))
    ctx.body = { message: 'success' }
}

/**
 * @requires querystring.type
 * @requires querystring.name
 */
exports.getEndpoint = async (ctx, next) => {
    let { type, name } = ctx.query
    let mockConfig = await promisify(fs.readFile)(configPath)
    let resData = JSON.parse(mockConfig)[type].endpoints
        .filter(x => x.name == name)[0]
    const filePath = path.join(rootPath, resData.filePath),
        fileData = await promisify(fs.readFile)(filePath)

    resData.fileData = fileData.toString()
    ctx.body = resData
}

/**
 * @requires querystring.type
 * @requires querystring.name
 * @requires request.body , to overwrite the config file in configs.
 * @param require.body.fileData , to overwrite the config file in configs.
 */
exports.editEndpoint = async (ctx, next) => {
    let body = ctx.request.body
    let { type, name } = ctx.query
    let mockConfig = await promisify(fs.readFile)(configPath)
    let fileJson = JSON.parse(mockConfig)
    let endPoint = fileJson[type].endpoints.filter(x => x.name == name)[0]
    const filePath = path.join(rootPath, endPoint.filePath)
    await promisify(fs.writeFile)(filePath, body.fileData)
    ctx.body = { message: 'success' }
}

/**
 * @requires querystring.type
 * @requires querystring.name
 */
exports.deleteEndpoint = async (ctx, next) => {
    let { type, name } = ctx.query
    let fileData = await promisify(fs.readFile)(configPath)
    let fileJson = JSON.parse(fileData)
    for (let i in fileJson[type].endpoints) {
        if (fileJson[type].endpoints[i].name == name) {
            let endPoint = fileJson[type].endpoints[i]
            //delete config file in configs folder
            let filePath = path.join(rootPath, endPoint.filePath)
            fs.unlinkSync(filePath)
            //delete in mock-server.json
            fileJson[type].endpoints.splice(i, 1)
        }
    }
    await promisify(fs.writeFile)(configPath, JSON.stringify(fileJson, null, 2))
    ctx.body = { message: 'success' }
}

/**
 * @requires querystring.type ， the type of endpoint you want to add
 * @requires request.body 
 * @param request.body.mockConfig will be added into the mock-server.json
 * @param request.body.fileData will be added into the configs folder as a '.hbs' file.
 */
exports.addEndpoint = async (ctx, next) => {
    let body = ctx.request.body
    let { type } = ctx.query
    let fileData = await promisify(fs.readFile)(configPath)
    let fileJson = JSON.parse(fileData)
    //add to mock-server.json
    fileJson[type].endpoints.push(body.mockConfig)
    await promisify(fs.writeFile)(configPath, JSON.stringify(fileJson, null, 2))
    //add config file to configs folder
    let filePath = path.join(rootPath, body.mockConfig.filePath)
    await promisify(fs.writeFile)(filePath, body.fileData)
    ctx.body = { message: 'success' }
}









