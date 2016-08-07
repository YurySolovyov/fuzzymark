const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        background: './src/backend/background/background.js',
        gettingStarted: './src/backend/getting-started/getting-started.js',
        frontend: './src/frontend/main.js',
        shared: ['jquery']
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
          { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') }
        ]
    },
    plugins: [
        new ExtractTextPlugin('required-styles.css'),
        new webpack.optimize.CommonsChunkPlugin('shared', 'shared.bundle.js')
    ],
    resolve: {
        alias: {
            vex: 'vex-js'
        }
    }
};
