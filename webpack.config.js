const webpack = require('webpack');

module.exports = {
    entry: {
        background: './src/backend/background/background.js',
        options: './src/backend/options/options.js',
        gettingStarted: './src/backend/getting-started/getting-started.js',
        frontend: './src/frontend/main.js',
        shared: ['jquery']
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("shared", "shared.bundle.js")
    ]
};
