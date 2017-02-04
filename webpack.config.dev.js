const webpack = require('webpack');
// This can be removed once this issue is resolved:
// https://github.com/webpack/webpack/issues/3460
const { CheckerPlugin } = require('awesome-typescript-loader');

const config = require('./webpack.config.js'); // eslint-disable-line

// For server path
config.output.publicPath = '/';
// path must be '/' or an absolute path for webpack-dev-server ver. 2
config.output.path = '/';

// For source maps
config.module.rules.push({
  test: /\.js$/,
  use: ['source-map-loader'],
  enforce: 'pre',
});
config.devtool = 'cheap-module-eval-source-map';

// For async error reporting, i.e. watch mode
config.plugins.push(new CheckerPlugin());
// Named modules for hot module reloading
config.plugins.push(new webpack.NamedModulesPlugin());

// For dev server
config.devServer = {
  publicPath: '/',
  // For react-router's browserHistory
  historyApiFallback: true,
};

// For Hot module reloading and sourceMap
config.module.rules.shift();
config.module.rules.push({
  test: /\.tsx?$/,
  exclude: /\.spec\.tsx?$/,
  use: {
    loader: 'awesome-typescript-loader',
    options: {
      useBabel: true,
      useCache: true,
      babelOptions: {
        presets: ['es2015', 'react-hmre'],
        plugins: ['transform-regenerator'],
      },
    },
  },
});

module.exports = config;
