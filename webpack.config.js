const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    background: './src/backend/background/background.js',
    frontend: './src/frontend/main.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }]
  },

  plugins: [
    new ExtractTextPlugin('css-loader'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      filename: 'shared.bundle.js'
    })
  ]
};
