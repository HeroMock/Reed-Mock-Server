# Reed Mock Server

Full feature mock server.

1. Restful API Mock
2. Transparent HTTP Proxy
3. Websocket Mock
4. Static File Serve


## How to use

```sh
npm i -g reed-mock-server

imock init

# after customized the 'mock-server.json', 'json-api.hbs'
imock start mock-server.json
```

## CLI

```sh
imock start -p 3000 -s "/" --static-dir "./dist" --api "/api" --api-data-path "./json-data.hbs" --ws-endpoint "/ws" --ws-data-path "./json-ws.hbs"


imock start -h
# Usage: start [options] [config]
# 
# start mock server
# 
# Options:
#   -p, --port <port>             Set port (default: 3000)
#   -P, --portal-port <port>      Set portal port (default: 3001)
#   -s, --static-endpoint <path>  Set static server endpoint
#   --static-dir <dir>            Set static files directory (default: "./dist")
#   --api, --api-endpoint <path>  Set api endpoint
#   --api-data-path <dir>         Set api data config's path (default: "./json-api.hbs")
#   --ws, --ws-endpoint <path>    Set Websocket webpoint
#   --ws-data-path <dir>          Set Websocket data config's path (default: "./json-ws.hbs")
#   --nc, --no-cors               Disable Cross-Origin Resource Sharing
#   -h, --help                    output usage information

```

## Sample mock server config json
```json
{
  "port": "3000",
  "timeout": 300,
  "serveStatic": {
    "enabled": true,
    "endpoints": [
      {
        "endpoint": "",
        "indexPages": [
          "index.html",
          "index.htm"
        ],
        "dirPath": "./dist"
      }
    ]
  },
  "serveApi": {
    "enabled": true,
    "endpoints": [
      {
        "name": "api1",
        "endpoint": "/api",
        "filePath": "./json-api.hbs",
        "options": {}
      }
    ]
  },
  "serveWebsocket": {
    "enabled": true,
    "endpoints": [
      {
        "endpoint": "/ws",
        "filePath": "./json-ws.hbs",
        "type": "timer",
        "interval": "500"
      }
    ],
    "options": {}
  },
  "serveProxy": {
    "enabled": true,
    "endpoints": [
      {
        "endpoint": "/proxy-foo",
        "target": "http://some-service/api/"
      }
    ],
    "options": {}
  },
  "customMiddleware": {
    "front": [],
    "last": []
  },
  "portal": {
    "port": 3001
  }
}
```

## More custom options

1. API proxy is powered by [http-proxy](https://github.com/nodejitsu/node-http-proxy), more options could be found [here](https://github.com/nodejitsu/node-http-proxy#options).

2. Json data generation is powered by [dummy-json](https://github.com/webroo/dummy-json), available helpers could be found [here](https://github.com/webroo/dummy-json#available-helpers)

## TODO

1. Add Cache control for static file serve
