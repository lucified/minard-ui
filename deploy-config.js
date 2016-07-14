
const lucifyDeployConfig = require('lucify-deploy-config').default;

const opts = {
  bucket: (env) => {
    if (env === 'production') {
      return 'lucify-protected';
    }
    if (env === 'staging') {
      return 'lucify-staging-new';
    }
    return null;
  },
  baseUrl: (env) => {
    if (env === 'production') {
      return 'https://protected.lucify.com/';
    }
    if (env === 'staging') {
      return 'https://staging.lucify.com/';
    }
    return null;
  },
  publicPath: (env) => {
    if (env === 'production' || env === 'staging') {
      return '/minard/';
    }
    return null;
  },
  flow: '275d5d70-71e4-47c3-8c93-608e6bf16d8f', // The minard development flow
};

module.exports = lucifyDeployConfig(null, opts);
