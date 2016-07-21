
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
  flow: 'bdc6c13b-be3f-42a9-9f71-e9197dd8fb03', // The main flow
};

module.exports = lucifyDeployConfig(null, opts);
