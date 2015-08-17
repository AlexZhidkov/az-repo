// Karma configuration
// Generated on Wed Jul 30 2014 14:01:05 GMT+0800 (W. Australia Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '../scripts/angular.js',
	  '../scripts/angular-mocks.js',
      '../scripts/angular-resource.js',
      '../scripts/angular-route.js',
      '../scripts/angular-ui/ui-bootstrap-tpls.js',
      '../scripts/angular-ui/ui-bootstrap.js',
      '../scripts/jquery-2.1.1.js',
      '../scripts/bootstrap.js',
      '../scripts/toastr.js',
      // Explicitly reference the root application.
      '../app/app.js',
      // Wildcard to reference the remaining scripts in app (not the sub folders).
      '../app/*.js',
      // Need to explicitly reference each module component.
      '../app/application/application.js',
	  '../app/application/firearm/application-firearm.js',
	  '../app/licence/licence.js',
	  '../app/licence/firearm/licence-firearm.js',
      '../app/task/task.js',
      // Wildcard to reference the remaining scripts in the app sub folders.
      '../app/**/*.js',
      // Wildcard to reference every test script.
	  '**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};