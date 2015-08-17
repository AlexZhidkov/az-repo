// Karma configuration
// Generated on Mon Aug 25 2014 16:54:18 GMT+0800 (W. Australia Standard Time)
//http://www.ng-newsletter.com/advent2013/#!/day/19
//https://github.com/katowulf/mockfirebase
//https://github.com/firebase/angularfire-seed/tree/master/test
//http://angular.github.io/protractor/#/tutorial

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['ng-scenario'],


    // list of files / patterns to load in the browser
    files: [
      '../../scripts/angular.js',
	  '../../scripts/angular-mocks.js',
      '../../scripts/angular-resource.js',
      '../../scripts/angular-route.js',
      '../../scripts/angular-ui/ui-bootstrap-tpls.js',
      '../../scripts/angular-ui/ui-bootstrap.js',
      '../../scripts/jquery-2.1.1.js',
      '../../scripts/bootstrap.js',
      '../../scripts/toastr.js',
      '../../bower_components/**/*.js',
      // Explicitly reference the root application.
      '../../app.js',
      // Wildcard to reference every test script.
      '*.js',
	  '**/*.js'
    ],


    // list of files to exclude
    exclude: [
      '../../bower_components/angular/*.js',
      '../../bower_components/firebase/firebase-debug.js',
      '../../bower_components/firebase-simple-login/firebase-simple-login-debug.js',
      '../*.js'
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
    //port: 8080,
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    proxies: {
        '/#/': 'http://localhost:51942/#/'
    },

      // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  });
};
