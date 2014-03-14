// Karma configuration
// Generated on Thu Aug 29 2013 15:59:23 GMT-0700 (PDT)

var find = function(arr, predicate) {
	for (var i = 0, value, l = arr.length; i < l && i in arr; i++) {
		value = arr[i];

		if (predicate(value, i, arr)) {
			return value;
		}
	}

	return undefined;
};

module.exports = function(config) {
	var files = [
		'build/css/base.min.css',
		'build/test/js/sinon.js',
		'build/test/js/testenv.js',
		'build/js/lib-dev.js',
		'https://js.balancedpayments.com/1.1/balanced.js',
		'build/js/dashboard-dev.js',
		'build/test/js/test-fixtures.js',
		'build/test/js/testconfig.js',
		'test/lib/*.js', {
			pattern: 'build/**/*',
			watched: true,
			included: false,
			served: true
		}
	];

	var PARAMETER = '--file=';

	var arg = find(process.argv, function(arg) {
		return arg.indexOf(PARAMETER) >= 0
	});

	if (arg) {
		var file = arg.substr(PARAMETER.length).split(',');
		file.forEach(function(val) {
			files.push(val);
		});
	} else {
		files.push('test/unit/**/*');
		files.push('test/integration/**/*');
	}

	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',

		// frameworks to use
		frameworks: ['qunit'],

		// list of files / patterns to load in the browser
		files: files,

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
		port: 9877,

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
		singleRun: true,

		proxies: {
			'/build': 'http://localhost:9877/build',
			'/images': 'http://localhost:9877/build/images'
		}
	});
};
