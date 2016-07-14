
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
      return '/hello-world/';
    }
    return null;
  },
  flow: '2dc8dfef-2d5c-441d-9a87-e46d6266babb', // The testing flow
};

module.exports = lucifyDeployConfig(null, opts);
