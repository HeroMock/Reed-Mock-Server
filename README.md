# Reed Mock Server
1. Restful API Mock
2. Existing API Transparent Proxy
3. Websocket Mock
4. Static File Service


# How to use

```sh
npm i -D reed-mock-server

reed-mock init

# after customized the 'mock-server.json', 'json-api.hbs'
reed-mock start
```


# More custom options
1. Static Server is served by [koa-send](https://github.com/koajs/send), more options could be found [here](https://github.com/koajs/send#options).

2. API proxy is powered by [http-proxy](https://github.com/nodejitsu/node-http-proxy), more options could be found [here](https://github.com/nodejitsu/node-http-proxy#options).