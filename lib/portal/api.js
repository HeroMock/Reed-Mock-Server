const fs = require('fs'),
    { promisify } = require('util'),
    path = require('path'),
    Config = require('../config')

const configPath = process.env.MockConfig
const rootPath = path.dirname(configPath)

exports.getConfig = async (ctx, next) => {
    ctx.body = Config
}

/** 
 * @requires request.body ,used to overwrite the mock-server.json
 */
exports.setConfig = async (ctx, next) => {
    let newConfig = ctx.request.body
    // overwrite to RAM
    Object.keys(Config).forEach(s => delete Config[s])
    Object.keys(newConfig).forEach(s => Config[s] = newConfig[s])
    // overwrite to ROM
    await promisify(fs.writeFile)(configPath, JSON.stringify(Config, null, 2))
    ctx.body = { message: 'success' }
}

/**
 * @requires querystring.type
 * @requires querystring.name
 */
exports.getEndpoint = async (ctx, next) => {
    let { type, name } = ctx.query
    let resData = Config[type].endpoints.filter(x => x.name == name)[0]
    resData=JSON.parse(JSON.stringify(resData))
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
    let endPoint = Config[type].endpoints.filter(x => x.name == name)[0]
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
    for (let i in Config[type].endpoints) {
        if (Config[type].endpoints[i].name == name) {
            let endPoint = Config[type].endpoints[i]
            //delete config file in configs folder
            let filePath = path.join(rootPath, endPoint.filePath)
            fs.unlinkSync(filePath)
            //delete in mock-server.json
            Config[type].endpoints.splice(i, 1)
        }
    }
    await promisify(fs.writeFile)(configPath, JSON.stringify(Config, null, 2))
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
    //add to mock-server.json RAM
    Config[type].endpoints.push(body.mockConfig)
    //add to mock-server.json ROM
    await promisify(fs.writeFile)(configPath, JSON.stringify(Config, null, 2))
    //add template file
    let filePath = path.join(rootPath, body.mockConfig.filePath)
    await promisify(fs.writeFile)(filePath, body.fileData)
    ctx.body = { message: 'success' }
}









