
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
      return 'https://minard.lucify.com/';
    }
    return 'https://minard-staging.lucify.com/';
  },
  publicPath: (env) => {
    if (env === 'production' || env === 'staging') {
      return '/';
    }
    return null;
  },
  flow: 'bdc6c13b-be3f-42a9-9f71-e9197dd8fb03', // The Main flow ID
};

const env = process.env.CIRCLE_BRANCH === 'master' ? process.env.LUCIFY_ENV || 'staging'
  : process.env.LUCIFY_ENV || process.env.NODE_ENV || 'development';

module.exports = lucifyDeployConfig(env, opts);
