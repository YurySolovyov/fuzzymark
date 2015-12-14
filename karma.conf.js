module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: [
            'jasmine',
            'jasmine-matchers'
        ],
        files: [
            'test/*-spec.js'
        ],
        preprocessors: {
            'test/*-spec.js': ['webpack', 'sourcemap']
        },
        webpack: {
            devtool: 'inline-source-map'
        },
        webpackMiddleware: {
            noInfo: true
        },
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false,
        concurrency: Infinity,
        plugins: [
            require("karma-webpack"),
            require("karma-sourcemap-loader"),
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-mocha-reporter',
            'karma-chrome-launcher'
        ]
    };
    config.set(configuration);
};
