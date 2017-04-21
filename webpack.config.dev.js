/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const merge = require('webpack-merge');
// This can be removed once this issue is resolved:
// https://github.com/webpack/webpack/issues/3460
const { CheckerPlugin } = require('awesome-typescript-loader');

const productionConfig = require('./webpack.config.js'); // eslint-disable-line

const devOptions = {
  cache: true,

  // For server path
  output: {
    publicPath: '/',
    // path must be '/' or an absolute path for webpack-dev-server ver. 2
    path: '/',
    // [chunkhash] can't be used when webpack is started with --hot:
    // https://github.com/webpack/webpack-dev-server/issues/377
    filename: '[name].[hash].js',
  },

  module: {
    rules: [
      // For source maps
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre',
      },
      // For hot module reloading
      {
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
      },
    ],
  },
  devtool: 'cheap-module-eval-source-map',

  plugins: [
    // For awesome-typescript-loader's async error reporting, i.e. watch mode
    new CheckerPlugin(),
    // Named modules for hot module reloading
    new webpack.NamedModulesPlugin(),
  ],

  // For dev server
  devServer: {
    publicPath: '/',
    // For react-router's browserHistory
    historyApiFallback: {
      // Needed for handling react-router params that contain dots, i.e. raw deployment redirects:
      // https://github.com/ReactTraining/react-router/issues/3409#issuecomment-272023984
      disableDotRule: true,
    },
  },
};

module.exports = merge.smart(productionConfig, devOptions);
