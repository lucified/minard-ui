
const lucifyDeployConfig = require('lucify-deploy-config').default; // eslint-disable-line

const opts = {
  bucket: (env) => {
    if (env === 'production') {
      return 'lucify-protected';
    }
    if (env === 'staging') {
      return 'minard-ui-staging';
    }
    return null;
  },
  baseUrl: (env) => {
    if (env === 'production') {
      return 'https://protected.lucify.com/';
    }
    if (env === 'staging') {
      return 'https://minard-staging.lucify.com/';
    }
    return null;
  },
  publicPath: (env) => {
    if (env === 'production' || env === 'staging') {
      return '/';
    }
    return null;
  },
  flow: 'bdc6c13b-be3f-42a9-9f71-e9197dd8fb03', // The Main flow ID
};

const env = process.env.CIRCLE_BRANCH === 'master' ? 'staging'
  : process.env.LUCIFY_ENV || process.env.NODE_ENV || 'development';

module.exports = lucifyDeployConfig(env, opts);
