/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssReporter = require('postcss-reporter');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

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

const name = '[name].[hash:8].[ext]';

/*
 * Get the webpack loaders object for the webpack configuration
 */
const rules = [
  {
    test: /\.tsx?$/,
    exclude: /\.spec\.tsx?$/,
    use: {
      loader: 'awesome-typescript-loader',
      options: {
        useBabel: true,
        useCache: true,
        babelOptions: {
          presets: [
            // Make babel not transform modules since webpack 2 supports ES6 modules
            // This should allow webpack to perform tree-shaking.
            // TODO: Tree-shaking doesn't seem to work. Change tsconfig to
            // output ES6 modules once this is fixed:
            // https://github.com/webpack/webpack/issues/2867
            ['es2015', { modules: false }],
          ],
          // Needed in order to transform generators. Babelification can be removed
          // once TypeScript supports generators, probably in TS 2.3.
          // When that is done, also change the output of TS to 'es5' in tsconfig.json
          plugins: ['transform-regenerator'],
        },
      },
    },
  },
  {
    test: /\.(jpeg|jpg|gif|png)$/,
    use: [{
      loader: 'file-loader',
      options: {
        name,
      },
    }],
  },
  {
    test: /\.hbs$/,
    use: [{
      loader: 'handlebars-loader',
    }],
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
      fallback: 'style-loader',
      use: 'css-loader',
    }),
  },
  {
    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/font-woff',
        name,
      },
    }],
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'application/octet-stream',
        name,
      },
    }],
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: 'file-loader',
      options: {
        name,
      },
    }],
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        mimetype: 'image/svg+xml',
        name,
      },
    }],
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

function getCharles() {
  if (deployConfig.env === 'production' && process.env.CHARLES_PRODUCTION) {
    return process.env.CHARLES_PRODUCTION;
  }

  if (deployConfig.env === 'staging' && process.env.CHARLES_STAGING) {
    return process.env.CHARLES_STAGING;
  }

  return process.env.CHARLES || false;
}

function getStreamingAPI() {
  if (deployConfig.env === 'production' && process.env.CHARLES_STREAMING_PRODUCTION) {
    return process.env.CHARLES_STREAMING_PRODUCTION;
  }

  if (deployConfig.env === 'staging' && process.env.CHARLES_STREAMING_STAGING) {
    return process.env.CHARLES_STREAMING_STAGING;
  }

  return process.env.CHARLES_STREAMING || getCharles();
}

const config = {
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    rules,
  },
  output: {
    // [chunkhash] needs to be used in order for the hash to stay the same if the contents of the chunk
    // hasn't changed (e.g. no new libraries have been added => vendor.js stays the same).
    filename: '[name].[chunkhash].js',
    path: path.join(__dirname, deployConfig.base.dest),
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
      'process.env.ENV': JSON.stringify(deployConfig.env),
      'process.env.VERSION': JSON.stringify(deployConfig.base.commit),
      'process.env.AUTH0_CLIENT_ID': JSON.stringify(process.env.AUTH0_CLIENT_ID || 'ZaeiNyV7S7MpI69cKNHr8wXe5Bdr8tvW'),
      'process.env.AUTH0_DOMAIN': JSON.stringify(process.env.AUTH0_DOMAIN || 'lucify-dev.eu.auth0.com'),
      'process.env.AUTH0_AUDIENCE': JSON.stringify(process.env.AUTH0_AUDIENCE || 'http://localtest.me:8000'),
    }),
    new ExtractTextPlugin({
      filename: 'bundled.[hash].css',
      // allChunks is needed for CommonsChunkPlugin:
      // https://github.com/webpack/webpack/issues/959#issuecomment-276685210
      allChunks: true,
    }),
    new CopyWebpackPlugin([{
      from: 'static/*',
      flatten: true,
    }]),
    // Put all included NPM packages into its own file.
    // https://webpack.js.org/plugins/commons-chunk-plugin/#combining-implicit-common-vendor-chunks-and-manifest-file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    // Put webpack runtime into its own file. This changes on each build and we
    // don't want it to get included in the vendor file.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
  ],
};

if (['production', 'staging'].indexOf(deployConfig.env) > -1) {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    // LoaderOptionsPlugin with minimize:true will be removed in Webpack 3.
    // Will need to add minimize: true to loaders at that point.
    // See https://webpack.js.org/guides/migrating/#uglifyjsplugin-minimize-loaders
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new BabiliPlugin(),
  ]);
}

module.exports = config;
