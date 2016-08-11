
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');

const deployConfig = require('./deploy-config');

const environments = [
  'test',
  'development',
  'staging',
  'production',
];

const getEntrypoint = (env, charles) => {
  let middle = env;
  if (env === 'test' || !charles) {
    // No remote backend
    middle = 'local-json';
  } else if (!env || environments.indexOf(env) < 0) {
     // Default to development if env is not one
     // of the allowed values
    middle = 'development';
  }
  return `./src/js/entrypoint.${middle}.tsx`;
};

/*
 * Get the webpack loaders object for the webpack configuration
 */
const loaders = [
  {
    test: /\.tsx?$/,
    exclude: /\.spec\.tsx?$/,
    loaders: [
      'babel-loader?presets[]=es2015&plugins[]=transform-regenerator',
      'ts-loader',
    ],
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
  // For Font Awesome. From https://gist.github.com/Turbo87/e8e941e68308d3b40ef6
  {
    test: /\.css$/,
    loader: 'style!css?sourceMap',
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file',
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url?limit=10000&mimetype=image/svg+xml',
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
  entry: [
    'babel-polyfill',
    getEntrypoint(process.env.LUCIFY_ENV || process.env.NODE_ENV, process.env.CHARLES),
  ],
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
  ],
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
  },
};

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env.CHARLES': JSON.stringify(process.env.CHARLES || false),
  }),
]);

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
