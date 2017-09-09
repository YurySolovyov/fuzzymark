const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    background: './src/backend/background/background.js',
    frontend: './src/frontend/main.js'
  },

  output: {
    path: path.resolve(__dirname, 'extension', 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({ use: 'css-loader' })
    }, {
      test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
      use: 'url-loader',
    }, {
      test: /\.vue$/,
      use: 'vue-loader',
    }]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      filename: 'shared.bundle.js'
    })
  ],

  resolve: {
    alias: {
      styles: path.resolve(__dirname, 'src/styles')
    }
  }
};
