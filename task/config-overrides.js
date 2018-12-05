let path = require('path');

module.exports = function override(config, env) {
  //do stuff with the webpack config...
  // reset
  config.output.publicPath = '../';
  config.output.path = path.resolve(path.resolve(__dirname, '') + '/output/pc');
  config.output.filename = 'js/bundle.js';
  config.output.chunkFilename = 'js/[name].[chunkhash].chunk.js';
  config.plugins[1].options.filename = 'html/index.html';
  config.plugins[4].filename = 'css/[name].[contenthash:8].css';
  // mainfest
  config.plugins[5].opts.fileName = 'asset/asset-mainfest.json';
  // img
  config.module.rules[1].oneOf[0].options.name = 'images/[name].[hash:8].[ext]';
  // console.log(config)
  return config;
}