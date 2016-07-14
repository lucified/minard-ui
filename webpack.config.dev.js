const config = require('./webpack.config.js');
config.output.publicPath = '/';
//config.module.loaders[0].query.presets.push('react-hmre');
module.exports = config;
