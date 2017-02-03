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
    return 'https://staging.minard.io/';
  },
  publicPath: (env) => {
    // For Minard
    if (process.env.GITLAB_CI) {
      return '/';
    }

    if (['production', 'staging'].indexOf(env) > -1) {
      return '/';
    }

    return null;
  },
  flow: 'bdc6c13b-be3f-42a9-9f71-e9197dd8fb03', // The Main flow ID
};

const env = process.env.LUCIFY_ENV || (
  process.env.CIRCLE_BRANCH === 'master' ?
    'staging' :
    process.env.NODE_ENV || 'development'
);

module.exports = lucifyDeployConfig(env, opts);
