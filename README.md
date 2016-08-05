
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
## Development

```shell
npm start # then open http://localhost:3000/ in a browser
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
npm run-script deploy
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

Run `npm run-script` to see other available commands.
