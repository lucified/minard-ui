
const lucifyDeployConfig = require('lucify-deploy-config').default;

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

// TODO: change 'qa' to 'master' before merging
const env = process.env.CIRCLE_BRANCH === 'qa' ? 'staging' : null;
module.exports = lucifyDeployConfig(env, opts);
