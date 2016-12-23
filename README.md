
# Minard UI single-page app

[Minard](https://www.lucify.com/minard) is a preview service that
integrates with version control, automatically
building and deploying each version of your project. Minard makes it easy
to share functional versions of quick web projects for feedback.

This repository contains the Minard UI single page app. It is meant to be
used together with [minard-backend](https://github.com/lucified/minard-backend).

The main technologies used to build minard-ui are:

- TypeScript 2.0
- React + react-router
- Redux
- redux-saga

## Requirements

Node 6, NPM and tslint must be installed.

```shell
npm install -g tslint tslint-react
```

## Development

Set up the development environment with:

```shell
npm install
```

### Standalone development using the bundled JSON files

```shell
npm start # then open http://localhost:3000/ in a browser
```

### Development with minard-backend

Install minard-backend locally or on a separate server and start
minard-ui with:

```shell
npm start -- <minard-backend API URL> <Team ID> # then open http://localhost:3000/ in a browser
```

By default, when run locally, the minard-backend (charles) API runs
on `http://localhost:8000`:

```shell
npm start -- http://localhost:8000 3
```

Note that the team ID needs to match the ID of a team that has been
created in [minard-backend](https://github.com/lucified/minard-backend).

## Building for production

Build a production version of the app into `dist/` by running:

```shell
NODE_ENV=production CHARLES=<API URL> npm run build
```

To watch for changes and update the build accordingly, run:

```shell
NODE_ENV=production CHARLES=<API URL> npm run watch
```

## Testing

Run `npm test`. To start a test watcher, run `npm run test:watch`.

## Other commands

Run `npm run` to see other available commands.

## Acknowledgements

Thank you to the [Google Digital News Inititiative](https://www.digitalnewsinitiative.com/) and
[Helsingin Sanomat Foundation](http://www.hssaatio.fi/en/) for supporting our work
on the Minard prototype.
