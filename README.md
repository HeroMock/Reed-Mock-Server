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

## CLI

```sh
imock start -p 3000 -s "/" --static-dir "./dist" --api "/api" --api-data-path "./json-data.hbs" --ws-endpoint "/ws" --ws-data-path "./json-ws.hbs"

imock start --config "mock-server.json"

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
