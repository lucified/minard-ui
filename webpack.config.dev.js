const config = require('./webpack.config.js');

// For server path
config.output.publicPath = '/';

// For source maps
config.module.preloaders.push({ test: /\.js$/, loader: 'source-map-loader' });
config.devtool = 'source-map';

// For dev server
config.devServer = {
  publicPath: '/',
};

// For Hot module reloading
config.module.loaders.shift();
config.module.loaders.push({
  test: /\.tsx?$/,
  exclude: /\.spec\.tsx?$/,
  loaders: [
    'babel-loader?presets[]=es2015&presets[]=react-hmre&plugins[]=transform-regenerator',
    'ts-loader',
  ],
});

module.exports = config;
