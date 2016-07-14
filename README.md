
# Minard UI single-page app

## Install

```shell
npm install
```
## Development

```shell
npm start # then open http://localhost:3000/ in a browser
```
## Deploy

TODO: do not do this yet

Deploy to Lucify's production environment with
```shell
LUCIFY_ENV=production \
AWS_PROFILE=lucify-protected \
npm run-script deploy
```
Prerequisites:
 - The AWS profile `lucify-protected` is defined `~/.aws/credentials`.

# Test

Run `npm test`

## Other commands

Run `npm run-script` to see other available commands.