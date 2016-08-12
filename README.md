
# Minard UI single-page app

The Minard single page app. Technologies used:

- TypeScript 2.0
- React + react-router
- Redux
- redux-saga
- [Spectre CSS](https://picturepan2.github.io/spectre/)
- [Font Awesome](http://fontawesome.io/icons/) + react-fontawesome

## Requirements

NPM must be installed.

```shell
npm install -g typescript tslint tslint-react
```

## Install

```shell
npm install
npm link typescript
```

## Development with bundled JSON files

```shell
npm start # then open http://localhost:3000/ in a browser
```

## Development with backend

```shell
npm start -- <API URL>
```

By default, the minard-backed (charles) API runs on `http://localhost:8000`:

```shell
npm start -- <API URL>
```

## Building for production

You can build the project into `dist/` by running:

```shell
NODE_ENV=production CHARLES=<API URL> npm run build
```

To have it watch for changes and update the build accordingly, run:

```shell
NODE_ENV=production CHARLES=<API URL> npm run watch
```

## Local deployment

Prerequisites:
 - The AWS profile `lucify-protected` is defined `~/.aws/credentials`.

Deploy to Lucify's production environment with
```shell
LUCIFY_ENV=production \
AWS_PROFILE=lucify-protected \
GITHUB_TOKEN='' \
FLOW_TOKEN=$FLOW_TOKEN_MAIN \
npm run deploy
```

Where `$FLOW_TOKEN_MAIN` is the [Flow token](https://www.flowdock.com/account/tokens)
to the Flowdock flow in which you wish to be notified once the
deployment has finished.

Note that we set `GITHUB_TOKEN` to an empty string to
make sure it is not defined, so that we don't send any
notifications of local deployments to GitHub deployment API.

# Test

Run `npm test`. To start a watcher, run `npm run test:auto`.

## Other commands

Run `npm run` to see other available commands.
