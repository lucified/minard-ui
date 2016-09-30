const util = require('util');

const deployConfig = require('./deploy-config');
const base = deployConfig.base;
const env = process.env;

function logObject(obj: any) {
  console.log(util.inspect(obj, { colors: true, depth: 4 }));
}

logObject({
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
  AWS_SESSION_TOKEN: env.AWS_SESSION_TOKEN,
});

module.exports = {
  deployment: {
    branch: {
      ref: base.branch,
      owner: env.CIRCLE_PROJECT_USERNAME || 'lucified',
      repository: base.project,
    },
    committer: env.CIRCLE_USERNAME || env.GITHUB_USERNAME,
    url: base.url,
    build_url: env.CIRCLE_BUILD_URL,
    environment: deployConfig.env,
  },
  github: {
    s3_credentials: 'lucify-configuration/lucify-notifier/github_integration_credentials.json',
    deploymentOptions: {
      transient_environment: true,
    },
  },
  flowdock: {
    flow_token: '',
    author: {
      email: 'deploy@lucify.com',
    },
  },
};
