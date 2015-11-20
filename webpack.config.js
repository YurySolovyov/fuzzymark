module.exports = {
    entry: {
        background: './src/backend/background/background.js',
        options: './src/backend/options/options.js',
        frontend: './src/frontend/main.js'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    }
};
