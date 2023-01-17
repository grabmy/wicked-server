# Wicked Node js server

## Scripts

### `npm run build`

Builds the app at `build`, cleaning the folder first.

### `npm run test`

Runs the `jest` tests once.

## TODO

- Add node.js extension to config
- Add test with all main methods in methods.test.ts
- Test standalone wicked command execution outside prject
- Add test with modules (delete node_modules / execute command npm i / check existing and non existing modules)
- Add executing script without request / response
- Add access error log to Script
- Add starting / stopping launch script
- Add REST api test
- Add https local certifcate
- Disable list methods / mime types
- Add plugin system (middleware, start, stop)
- Use node-ts to execute .node.ts file
- Add routes alias to script and test routes
- Add node.ts extension to config
- Add protected directory by password
- JSON configuration example:

```json
{
  "name": "default",
  "port": 3000,
  "public": "public/",
  "script": {
    "runAtStart": "script/start.node.js",
    "runAtStop": "script/stop.node.js",
    "extensionNode": "node.js",
    "extensionNodeTs": "node.ts"
  },
  "routes": {
    "/api/*": "script/api.node.js",
    "/about": "script/about.node.js"
  },
  "log": {
    "error": {
      "enabled": true,
      "target": "file",
      "path": "log/error.log"
    },
    "access": {
      "enabled": true,
      "target": "file",
      "path": "log/access.log"
    }
  }
}
```

## DONE

## Pending

## Canceled
