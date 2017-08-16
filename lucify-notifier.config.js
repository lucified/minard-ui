const deployConfig = require('./deploy-config');

const base = deployConfig.base;
const env = process.env;

module.exports = {
  deployment: {
    branch: {
      ref: base.branch,
      owner: env.CIRCLE_PROJECT_USERNAME || 'lucified',
      repository: base.project,
    },
    committer: env.GITHUB_USERNAME || env.CIRCLE_USERNAME,
    url: base.url,
    build_url: env.CIRCLE_BUILD_URL,
    environment: deployConfig.env,
  },
  github: {
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
  decryption_key: 's3://lucify-configuration/lucifer/public-key.pem',
};
