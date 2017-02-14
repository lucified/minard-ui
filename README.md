
# Minard UI single-page app

[Minard](https://www.lucify.com/minard) is a preview service that
integrates with version control, automatically
building and deploying each version of your project. Minard makes it easy
to share functional versions of quick web projects for feedback.

Minard is still being prototyped, and thus might not be ready for production.
Any part of the app may change.

This repository contains the Minard UI single page app. It is meant to be
used together with [minard-backend](https://github.com/lucified/minard-backend).

The main technologies used to build minard-ui are:

- TypeScript 2.0
- React + react-router
- Redux
- redux-saga

## Requirements

Node.js version 6, yarn and tslint must be installed.

```shell
brew update
brew install yarn
yarn global add tslint tslint-react
```

## Development

Set up the development environment with:

```shell
yarn
```

### Standalone development using the bundled JSON files

```shell
yarn start # then open http://localhost:3000/ in a browser
```

### Development with minard-backend

Install minard-backend locally or on a separate server and start
minard-ui with:

```shell
yarn start -- <minard-backend API URL> # then open http://localhost:3000/ in a browser
```

By default, when run locally, the minard-backend (charles) API runs
on `http://localhost:8000`:

```shell
yarn start -- http://localhost:8000
```

Note that the team ID needs to match the ID of a team that has been
created in [minard-backend](https://github.com/lucified/minard-backend).

## Building for production

Build a production version of the app into `dist/` by running:

```shell
NODE_ENV=production \
CHARLES=<API URL> \
AUTH0_CLIENT_ID=<client ID> \
AUTH0_DOMAIN=<domain> \
AUTH0_AUDIENCE=<audience> \
yarn run build
```

To watch for changes and update the build accordingly, run:

```shell
NODE_ENV=production \
CHARLES=<API URL> \
AUTH0_CLIENT_ID=<client ID> \
AUTH0_DOMAIN=<domain> \
AUTH0_AUDIENCE=<audience> \
yarn run watch
```

## Testing

Run `yarn test`. To start a test watcher, run `yarn run test:watch`.

## Other commands

Run `yarn run` to see other available commands.

## Environment variables

- **NODE_ENV**: Used to set the environment. Set it to 'production' to enable optimizations. Defaults to 'development'.
- **LUCIFY_ENV**: Overrides NODEENV if set. Meant to be used for automatic deployments.
- **CHARLES_PRODUCTION**: URL for the backend server API when the environment is set to 'production'. Defaults to `https://charles.lucify.com`.
- **CHARLES_STAGING**: URL for the backend server API when the environment is set to 'staging'. Defaults to `https://charles-staging.lucify.com`.
- **CHARLES**: Fallback URL of the backend server API.
- **CHARLES_STREAMING_PRODUCTION**: URL for the streaming API when the environment is set to 'production'.
- **CHARLES_STREAMING_STAGING**: URL for the streaming API when the environment is set to 'staging'.
- **STREAMING_API**: Fallback URL of the streaming API. If no URL is set for the streaming API, falls back the charles API URL.
- **AUTH0_CLIENT_ID**: The client ID for Auth0. Defaults to the client in Lucify's dev account.
- **AUTH0_DOMAIN**: The domain used for Auth0 authentication. Defaults to Lucify's dev account domain.
- **AUTH0_AUDIENCE**: The Auth0 audeince that we're requesting. Needs to match the correct API in Auth0. Defaults to `http://localhost:8000`.

## Acknowledgements

Thank you to the [Google Digital News Inititiative](https://www.digitalnewsinitiative.com/) and
[Helsingin Sanomat Foundation](http://www.hssaatio.fi/en/) for supporting our work
on the Minard prototype.
