const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const deployConfig = require('./deploy-config');

const getEntrypoint = (env, charles) => {
  let middle;
  if (!charles) {
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
const rules = [
  { // NOTE: babel-loader + ts-loader needs to be first in the array. See webpack.config.dev.js
    test: /\.tsx?$/,
    exclude: /\.spec\.tsx?$/,
    use: [
      'babel-loader?presets[]=es2015&plugins[]=transform-regenerator',
      'ts-loader',
    ],
  },
  {
    test: /\.(jpeg|jpg|gif|png)$/,
    use: [`file-loader?name=${name}`],
  },
  {
    test: /\.hbs$/,
    use: [`handlebars-loader?helperDirs[]=${__dirname}/src/templates/helpers`],
  },
  {
    test: /\.scss$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [
            autoprefixer,
            postcssReporter,
          ],
        },
      },
      'sass-loader',
    ],
  },
  // For Font Awesome. From https://gist.github.com/Turbo87/e8e941e68308d3b40ef6
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: 'css-loader',
    }),
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [`url-loader?limit=10000&mimetype=application/font-woff&name=${name}`],
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: [`url-loader?limit=10000&mimetype=application/octet-stream&name=${name}`],
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: [`file-loader?name=${name}`],
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [`url-loader?limit=10000&mimetype=image/svg+xml&name=${name}`],
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
  enableIntercom: (deployConfig.env === 'production'),
  icons: true,
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
  if (deployConfig.env === 'production') {
    if (process.env.CHARLES_PRODUCTION) {
      return process.env.CHARLES_PRODUCTION;
    }
    return 'https://charles.lucify.com';
  }
  if (deployConfig.env === 'staging') {
    if (process.env.CHARLES_STAGING) {
      return process.env.CHARLES_STAGING;
    }
    return 'https://charles-staging.lucify.com';
  }
  if (process.env.CHARLES) {
    return process.env.CHARLES;
  }
  return false;
}

function getStreamingAPI() {
  if (deployConfig.env === 'production' && process.env.CHARLES_STREAMING_PRODUCTION) {
    return process.env.CHARLES_STREAMING_PRODUCTION;
  }
  if (deployConfig.env === 'staging' && process.env.CHARLES_STREAMING_STAGING) {
    return process.env.CHARLES_STREAMING_STAGING;
  }
  if (process.env.CHARLES_STREAMING) {
    return process.env.CHARLES_STREAMING;
  }
  return getCharles();
}

const config = {
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules,
  },
  output: {
    filename: 'index-[hash].js',
    path: deployConfig.base.dest,
    publicPath: deployConfig.base.publicPath,
  },
  entry: [
    'babel-polyfill',
    getEntrypoint(deployConfig.env, getCharles()),
  ],
  plugins: [
    new HtmlWebpackPlugin(htmlWebpackPluginConfig),
    new webpack.DefinePlugin({
      'process.env.CHARLES': JSON.stringify(getCharles()),
      'process.env.STREAMING_API': JSON.stringify(getStreamingAPI()),
      'process.env.TEAM_ID': JSON.stringify(getTeamId()),
      'process.env.ENV': JSON.stringify(deployConfig.env),
      'process.env.VERSION': JSON.stringify(deployConfig.base.commit),
    }),
    new ExtractTextPlugin('bundled-[hash].css'),
    new CopyWebpackPlugin([{
      from: 'src/images/favicon-*.png',
      flatten: true,
    }]),
  ],
};

if (['production', 'staging'].indexOf(deployConfig.env) > -1) {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // LopaderOptionsPlugin with minimize:true will be removed in Webpack 3.
    // Will need to add minimize: true to loaders at that point.
    // See https://webpack.js.org/guides/migrating/#uglifyjsplugin-minimize-loaders
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
    }),
    new webpack.optimize.DedupePlugin(),
  ]);
}

module.exports = config;
