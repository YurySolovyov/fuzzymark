const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    background: './src/backend/background/background.js',
    frontend: './src/frontend/main.js',
    styles: './static/styles/style.css'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [{
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({ use: 'css-loader' })
    }, {
      test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
      use: 'url-loader',
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
    }]
  },

  plugins: [
    new ExtractTextPlugin({ filename: 'style.css', allChunks: true }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'shared',
      filename: 'shared.bundle.js'
    })
  ]
};
