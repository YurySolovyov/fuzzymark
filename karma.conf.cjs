const args = require('minimist')(process.argv.slice(2));

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = config => {
    var configuration = {
        basePath: '',
        frameworks: [
            'vite',
            'jasmine',
            'jasmine-matchers',
        ],
        files: [
            {
                pattern: 'test/*-spec.js',
                type: 'module',
            }
        ],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        reporters: ['mocha'],
        browsers: ['ChromeHeadless'],
        singleRun: args.singleRun,
        plugins: [
            'karma-vite',
            'karma-jasmine',
            'karma-jasmine-matchers',
            'karma-chrome-launcher',
            'karma-mocha-reporter'
        ]
    };
    
    config.set(configuration);
};
