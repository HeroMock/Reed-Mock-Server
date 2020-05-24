# Reed Mock Server

Full feature mock server.

1. Restful API Mock
2. Transparent HTTP Proxy
3. Websocket Mock
4. Static File Serve


## How to use

```sh
npm i -D reed-mock-server

imock init

# after customized the 'mock-server.json', 'json-api.hbs'
imock start
```


## More custom options

1. API proxy is powered by [http-proxy](https://github.com/nodejitsu/node-http-proxy), more options could be found [here](https://github.com/nodejitsu/node-http-proxy#options).

2. Json data generation is powered by [dummy-json](https://github.com/webroo/dummy-json), available helpers could be found [here](https://github.com/webroo/dummy-json#available-helpers)

## TODO

1. Add Cache control for static file serve
