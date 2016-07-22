
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');

const deployConfig = require('./deploy-config');

/*
 * Get the webpack loaders object for the webpack configuration
 */
const loaders = [
  {
    test: /\.tsx?$/,
    loader: 'ts-loader',
  },
  {
    test: /\.svg$/,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
  },
  {
    test: /\.(jpeg|jpg|gif|png)$/,
    loader: 'file-loader?name=[name]-[hash:12].[ext]',
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
  // For Font Awesome. From https://github.com/gowravshekar/font-awesome-webpack
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'file-loader',
  },
];

const htmlWebpackPluginConfig = {
  title: 'Minard',
  description: 'A preview server',
  template: require.resolve('./src/templates/index.hbs'),
  inject: false,
  filename: 'index.html',
  googleAnalytics: (process.env.LUCIFY_ENV === 'production'),
  googleAnalyticsSendPageView: (process.env.LUCIFY_ENV === 'production'),
};

const config = {
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    loaders,
    preloaders: [{ test: /\.js$/, loader: 'source-map-loader' }],
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
  entry: './src/js/entrypoint.tsx',
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
  ],
  devServer: {
    publicPath: '/',
  },
};

if (process.env.NODE_ENV === 'production' || process.env.LUCIFY_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
  ]);
}

module.exports = config;
