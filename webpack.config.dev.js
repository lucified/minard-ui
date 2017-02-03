const config = require('./webpack.config.js'); // eslint-disable-line

// For server path
config.output.publicPath = '/';

// For source maps
config.module.rules.push({
  test: /\.js$/,
  use: ["source-map-loader"],
  enforce: "pre"
});
config.devtool = 'source-map';

// For dev server
config.devServer = {
  publicPath: '/',
  // For react-router's browserHistory
  historyApiFallback: true,
};

// For Hot module reloading
config.module.rules.shift();
config.module.rules.push({
  test: /\.tsx?$/,
  exclude: /\.spec\.tsx?$/,
  use: [
    'babel-loader?presets[]=es2015&presets[]=react-hmre&plugins[]=transform-regenerator',
    'ts-loader',
  ],
});

module.exports = config;
