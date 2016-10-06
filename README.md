
# Minard UI single-page app

The Minard single page app. Technologies used:

- TypeScript 2.0
- React + react-router
- Redux
- redux-saga

## Requirements

NPM must be installed.

```shell
npm install -g tslint tslint-react
```

## Install

```shell
npm install
```

## Development with bundled JSON files

```shell
npm start # then open http://localhost:3000/ in a browser
```

## Development with backend

```shell
npm start -- <API URL> <Team ID>
```

By default, the minard-backed (charles) API runs on `http://localhost:8000`:

```shell
npm start -- http://localhost:8000 2
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

### To the Q/A environment

Deploy to Lucify's Minard Q/A environment with
```shell
LUCIFY_ENV=staging \
AWS_PROFILE=lucify-protected \
GITHUB_USERNAME='' \
CHARLES='https://charles-staging.lucify.com' \
FLOWDOCK_FLOW_TOKEN=$FLOW_MAIN \
FLOWDOCK_AUTHOR_NAME=$FLOWDOCK_AUTHOR \
npm run deploy
```

Where:
- `$FLOW_MAIN` is the Flow token to the Flowdock flow in which you wish to be notified
once the deployment has finished. You can get suitable tokens from the integrations menu of the relevant Flowdock flow.
- `$FLOWDOCK_AUTHOR_NAME` is your name, to be shown on Flowdock in the notification.

Note that we set `GITHUB_USERNAME` to an empty string to
make sure it is not defined, so that we don't send any
notifications of local deployments to GitHub deployment API.

Note that commits to `master` will automatically deploy to the Q/A environment.

# Test

Run `npm test`. To start a watcher, run `npm run test:auto`.

## Other commands

Run `npm run` to see other available commands.
