/* eslint-disable import/no-extraneous-dependencies */

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const failPlugin = require('webpack-fail-plugin');

const deployConfig = require('./deploy-config');

const getEntrypoint = (env, charles) => {
  let middle;
  if (env === 'test' || !charles) {
    // No remote backend
    middle = 'development.local-json';
  } else if (['staging', 'production'].indexOf(env) > -1) {
    // Use production configuration in staging
    middle = 'production';
  } else {
    // Default to development
    middle = 'development.server';
  }

  const entrypoint = `./src/js/entrypoint.${middle}.tsx`;
  console.log(`Using entrypoint ${entrypoint}`); // eslint-disable-line

  return entrypoint;
};

const name = '[name]-[hash:8].[ext]';

/*
 * Get the webpack loaders object for the webpack configuration
 */
const loaders = [
  { // NOTE: babel-loader + ts-loader needs to be first in the array. See webpack.config.dev.js
    test: /\.tsx?$/,
    exclude: /\.spec\.tsx?$/,
    loaders: [
      'babel-loader?presets[]=es2015&plugins[]=transform-regenerator',
      'ts-loader',
    ],
  },
  {
    test: /\.(jpeg|jpg|gif|png)$/,
    loader: `file-loader?name=${name}`,
  },
  {
    test: /\.hbs$/,
    loader: 'handlebars-loader',
  },
  {
    test: /\.scss$/,
    loaders: [
      'style-loader',
      'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader',
    ],
  },
  // For Font Awesome. From https://gist.github.com/Turbo87/e8e941e68308d3b40ef6
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader'),
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: `url-loader?limit=10000&mimetype=application/font-woff&name=${name}`,
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: `url?limit=10000&mimetype=application/octet-stream&name=${name}`,
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: `file?name=${name}`,
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: `url?limit=10000&mimetype=image/svg+xml&name=${name}`,
  },
];

const htmlWebpackPluginConfig = {
  title: 'Minard',
  description: 'A preview server',
  template: require.resolve('./src/templates/index.hbs'),
  inject: false,
  filename: 'index.html',
  googleAnalytics: (deployConfig.env === 'production'),
  googleAnalyticsSendPageView: (deployConfig.env === 'production'),
  files: {
    css: ['bundled.css'],
  },
};

function getTeamId() {
  if (process.env.TEAM_ID) {
    return process.env.TEAM_ID;
  }
  if (deployConfig.env === 'production') {
    return 4;
  }
  return 3;
}

function getCharles() {
  if (process.env.CHARLES) {
    return process.env.CHARLES;
  }
  if (deployConfig.env === 'production') {
    return 'https://charles.lucify.com';
  }
  if (deployConfig.env === 'staging') {
    return 'https://charles-staging.lucify.com';
  }
  return false;
}

const config = {
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    loaders,
    preloaders: [],
  },
  resolveLoader: {
    root: [path.resolve(__dirname, '../node_modules')],
  },
  output: {
    filename: 'index-[hash].js',
    path: deployConfig.base.dest,
    publicPath: deployConfig.base.publicPath,
  },
  postcss: function postcss() {
    return [
      autoprefixer,
      postcssReporter,
    ];
  },
  entry: [
    'babel-polyfill',
    getEntrypoint(deployConfig.env, getCharles()),
  ],
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
    new webpack.DefinePlugin({
      'process.env.CHARLES': JSON.stringify(getCharles()),
      'process.env.TEAM_ID': JSON.stringify(getTeamId()),
    }),
    new ExtractTextPlugin('bundled-[hash].css'),
    failPlugin,
  ],
};

if (['production', 'staging'].indexOf(deployConfig.env) > -1) {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]);
}

module.exports = config;
