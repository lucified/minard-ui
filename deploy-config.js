const lucifyDeployConfig = require('lucify-deploy-config').default; // eslint-disable-line

const opts = {
  bucket: (env) => {
    if (env === 'production') {
      return 'minard-ui-production';
    }
    return 'minard-ui-staging';
  },
  baseUrl: (env) => {
    if (env === 'production') {
      return 'https://minard.io/';
    }
    return 'https://minard.team/';
  },
  publicPath: (env) => {
    if (['production', 'staging'].indexOf(env) > -1) {
      return '/';
    }

    return null;
  },
  flow: 'bdc6c13b-be3f-42a9-9f71-e9197dd8fb03', // The Main flow ID
};

// LUCIFY_ENV is used by chatops. We always want to follow it if it's been set.
// CIRCLE_BRANCH is used by Circle. We automatically want to deploy the master
// branch to staging.
// GITLAB_CI has been set if we're in Minard. We want to simulate a staging
// environment in Minard.
// Otherwise, we use NODE_ENV or fall back to 'development'
const env = process.env.LUCIFY_ENV || (
  (process.env.CIRCLE_BRANCH === 'master' || process.env.GITLAB_CI) ?
    'staging' :
    process.env.NODE_ENV || 'development'
);

module.exports = lucifyDeployConfig(env, opts);
