const path = require('path');
const CLIEngine = require('eslint').CLIEngine;

const sourcesPath = 'src/**/';
const testsPath = 'tests/**/';

const lintSource = (function() {

    return new Promise(function(resolve, reject) {

        const engine = new CLIEngine({
            cache: true,
            useEslintrc: true,
            configFile: '.eslintrc.json'
        });

        const report = engine.executeOnFiles([
            path.resolve(sourcesPath),
            path.resolve(testsPath)
        ]);

        const hasErrors = report.errorCount > 0 || report.warningCount > 0;

        if (hasErrors) {
            var formatter = engine.getFormatter();
            console.log(formatter(report.results));
            reject(new Error('lint warnings'));
        }

        resolve();

    });

});

lintSource().then(function() {
    process.exit(0);
}).catch(function(e) {
    console.error(e);
    process.exit(1);
});
