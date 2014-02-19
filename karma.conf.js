// Karma configuration
// Generated on Thu Aug 29 2013 15:59:23 GMT-0700 (PDT)

module.exports = function(config) {
	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',

		// frameworks to use
		frameworks: ['qunit'],

		// list of files / patterns to load in the browser
		files: [
			'build/css/base.min.css',
			'build/test/js/sinon.js',
			'build/test/js/testenv.js',
			'build/js/lib-dev.js',
			'test/support/lib/balanced.min.js',
			'build/js/dashboard-dev.js',
			'build/test/js/test-fixtures.js',
			'test/support/testconfig.js',
			'test/lib/*.js',
			'test/unit/**/*',
			'test/integration/**/*'
		],

		// list of files to exclude
		exclude: [],

		preprocessors: {
			'build/js/dashboard-dev.js': ['coverage']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress', 'coverage'],

		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)

		// TravisCI only has Firefox and PhantomJS
		browsers: ['Firefox'],

		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,

		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};
