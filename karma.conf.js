module.exports = function(config) {
    var configuration = {
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'lib/*.js',
            '*.js',
            'test/*-spec.js',
        ],
        exclude: [
            'background.js',
            'main.js'
        ],
        preprocessors: {
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
            'karma-jasmine',
            'karma-mocha-reporter',
            'karma-chrome-launcher'
        ]
    }
    config.set(configuration);
}
