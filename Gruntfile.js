/*jshint camelcase: false */
/*global module:false */
module.exports = function(grunt) {

	grunt.initConfig({
		clean: {
			files: {
				src: ['build/', 'dist/', 'report/', 'js/', '.bower-tmp']
			}
		},

		// We're using the template here to construct an array of functions
		// that sets up Balanced so we can destroy and reconstruct the
		// entire app while running tests.
		neuter: {
			dev: {
				options: {
					includeSourceURL: true,
					template: "window.balancedSetupFunctions.push(function() { {%= src %} ; });"
				},
				src: ['app/dashboard.js'],
				dest: 'build/js/includes-dev.js'
			},
			prod: {
				options: {
					template: "window.balancedSetupFunctions.push(function() { {%= src %} ; });"
				},
				src: ['app/dashboard.js'],
				dest: 'build/js/includes-prod.js'
			},
			testfixtures: {
				options: {
					template: "{%= src %} ;"
				},
				src: ['test/support/fixtures/fixtures.js'],
				dest: 'build/test/js/test-fixtures.js'
			}
		},

		bower: {
			install: {
				options: {
					copy: false
				}
			}
		},

		concat: {
			options: {
				separator: ';\n'
			},
			dashboarddev: {
				src: [
					'app/app_setup.js',
					'build/js/includes-dev.js'
				],
				dest: 'build/js/dashboard-dev.js'
			},
			dashboardprod: {
				src: [
					'app/app_setup.js',
					'build/js/includes-prod.js'
				],
				dest: 'build/js/dashboard-prod.js'
			},
			libdev: {
				src: [
					'static/javascripts/jquery/jquery.js',
					'static/javascripts/handlebars/handlebars.runtime.js',
					'static/javascripts/ember/ember.js',
					'static/javascripts/shapeshifter/shapeshifter.js',
					'static/lib/ember-validations.prod.js',
					'static/lib/bootstrap-datepicker.js',
					'static/javascripts/bootstrap/js/bootstrap-dropdown.js',
					'static/javascripts/bootstrap/js/bootstrap-modal.js',
					'static/javascripts/bootstrap/js/bootstrap-tooltip.js',
					'static/javascripts/bootstrap/js/bootstrap-popover.js',
					'static/javascripts/lodash/dist/lodash.underscore.js',
					'static/javascripts/mixpanel/mixpanel.js',
					'static/javascripts/google-code-prettify/src/prettify.js',
					'static/javascripts/strftime/index.js',
					'static/javascripts/jquery-hotkeys/jquery.hotkeys.js',
					'static/javascripts/jquery.cookie/jquery.cookie.js',
					'static/javascripts/bootstrap-modal/js/bootstrap-modalmanager.js',
					'static/javascripts/bootstrap-modal/js/bootstrap-modal.js'
				],
				dest: 'build/js/lib-dev.js'
			},
			libprod: {
				src: [
					'static/javascripts/jquery/jquery.js',
					'static/javascripts/handlebars/handlebars.runtime.js',
					'static/javascripts/ember/ember.prod.js',
					'static/javascripts/shapeshifter/shapeshifter.js',
					'static/lib/ember-validations.prod.js',
					'static/lib/bootstrap-datepicker.js',
					'static/javascripts/bootstrap/js/bootstrap-dropdown.js',
					'static/javascripts/bootstrap/js/bootstrap-modal.js',
					'static/javascripts/bootstrap/js/bootstrap-tooltip.js',
					'static/javascripts/bootstrap/js/bootstrap-popover.js',
					'static/javascripts/lodash/dist/lodash.underscore.min.js',
					'static/javascripts/mixpanel/mixpanel.js',
					'static/javascripts/google-code-prettify/src/prettify.js',
					'static/javascripts/strftime/index.js',
					'static/javascripts/jquery-hotkeys/jquery.hotkeys.js',
					'static/javascripts/jquery.cookie/jquery.cookie.js',
					'static/javascripts/bootstrap-modal/js/bootstrap-modalmanager.js',
					'static/javascripts/bootstrap-modal/js/bootstrap-modal.js'
				],
				dest: 'build/js/lib-prod.js'
			},
			tests: {
				src: [
					'test/lib/*.js',
					'test/unit/**/*.js',
					'test/integration/**/*.js'
				],
				dest: 'build/test/js/tests.js'
			}
		},

		uglify: {
			dashboard: {
				options: {
					sourceMap: 'js/dashboard.map.js',
					sourceMapRoot: '/js/',
					sourceMappingURL: '/js/dashboard.map.js',
					sourceMapPrefix: 1
				},
				files: {
					'js/dashboard-prod.min.js': [
						'js/dashboard-prod.js'
					]
				}
			},
			lib: {
				options: {
					sourceMap: 'js/lib.map.js',
					sourceMapRoot: '/js/',
					sourceMappingURL: '/js/lib.map.js',
					sourceMapPrefix: 1
				},
				files: {
					'js/lib-prod.min.js': [
						'js/lib-prod.js'
					]
				}
			}
		},

		/*
		Finds Handlebars templates and precompiles them into functions.
		The provides two benefits:

		1. Templates render much faster
		2. We only need to include the handlebars-runtime microlib
		and not the entire Handlebars parser.

		Files will be written out to build/compiled/templates.js
		which is required within the project files so will end up
		as part of our application.

		The compiled result will be stored in
		Ember.TEMPLATES keyed on their file path (with the 'app/templates' stripped)
		*/
		emberTemplates: {
			options: {
				templateName: function(sourceFile) {
					return sourceFile.replace(/app\/templates\//, '');
				}
			},
			'build/js/compiled-templates.js': ["app/templates/**/*.hbs"]
		},

		less: {
			development: {
				options: {
					paths: ["assets/css"]
				},
				files: {
					"build/css/base.css": "static/less/base.less",
					"build/css/print.css": "static/less/print.less"
				}
			},
			production: {
				options: {
					paths: ["assets/css"],
					yuicompress: true
				},
				files: {
					"build/css/base.min.css": "static/less/base.less",
					"build/css/print.min.css": "static/less/print.less"
				}
			}
		},

		copy: {
			css: {
				files: [{
					cwd: 'build/css/',
					expand: true,
					src: ['**'],
					dest: 'dist/css/'
				}]
			},
			images: {
				files: [{
					cwd: 'static/images/',
					expand: true,
					src: ['**'],
					dest: 'build/images/'
				}, {
					cwd: 'static/images/',
					expand: true,
					src: ['**'],
					dest: 'build/test/images/'
				}]
			},
			fonts: {
				files: [{
					cwd: 'static/fonts/',
					expand: true,
					src: [
						'*.eot',
						'*.svg',
						'*.ttf',
						'*.woff'
					],
					dest: 'build/fonts/'
				}, {
					cwd: 'static/fonts/',
					expand: true,
					src: [
						'*.eot',
						'*.svg',
						'*.ttf',
						'*.woff'
					],
					dest: 'build/test/fonts/'
				}]
			},
			dist: {
				files: [{
					cwd: 'build/js/',
					expand: true,
					src: ['*-prod.min-*.js'],
					dest: 'dist/js/'
				}, {
					cwd: 'build/css/',
					expand: true,
					src: ['*.min-*.css'],
					dest: 'dist/css/'
				}, {
					src: 'build/prod.html',
					dest: 'dist/index.html'
				}, {
					cwd: 'build/images/',
					expand: true,
					src: ['**'],
					dest: 'dist/images/'
				}, {
					cwd: 'build/fonts/',
					expand: true,
					src: ['**'],
					dest: 'dist/fonts/'
				}]
			},
			test: {
				files: [{
					cwd: 'test/support/static/',
					expand: true,
					src: ['**'],
					dest: 'build/test/'
				}, {
					cwd: 'test/support/lib/',
					expand: true,
					src: ['**'],
					dest: 'build/test/js'
				}, {
					src: 'test/support/testconfig.js',
					dest: 'build/test/js/testconfig.js'
				}, {
					src: 'test/support/testenv.js',
					dest: 'build/test/js/testenv.js'
				}, {
					src: 'test/support/fixturebrowserconfig.js',
					dest: 'build/test/js/fixturebrowserconfig.js'
				}]
			},
			preUglify: {
				files: [{
					expand: true,
					flatten: true,
					src: ['build/js/dashboard-prod.js', 'build/js/lib-prod.js'],
					dest: 'js/'
				}]
			},
			postUglify: {
				files: [{
					expand: true,
					flatten: true,
					src: ['js/*'],
					dest: 'dist/js/'
				}]
			}
		},


		/*jshint multistr: true */
		'compile-handlebars': {
			dev: {
				template: 'app/index.html.hbs',
				templateData: {
					cssFile: "css/base.css",
					printCssFile: "css/print.css",
					jsLibFile: "js/lib-dev.js",
					jsDashboardFile: "js/dashboard-dev.js",
					includeLiveReload: true,
					env: "{\
						BALANCED: {\
							API: 'https://api.balancedpayments.com',\
							AUTH: 'https://auth.balancedpayments.com',\
							WWW: 'https://www.balancedpayments.com',\
							DOCS: 'https://docs.balancedpayments.com',\
							DEBUG: true,\
							MIXPANEL: '',\
							GOOGLE_ANALYTICS: ''\
						}\
					}",
					ext: grunt.file.exists('./ext.json') ? grunt.file.read('./ext.json') : ''
				},
				output: 'build/dev.html'
			},
			prod: {
				template: 'app/index.html.hbs',
				templateData: {
					cssFile: "css/base.min.css",
					printCssFile: "css/print.min.css",
					jsLibFile: "js/lib-prod.min.js",
					jsDashboardFile: "js/dashboard-prod.min.js",
					includeLiveReload: false,
					env: "{\
						BALANCED: {\
							API: 'https://api.balancedpayments.com',\
							AUTH: 'https://auth.balancedpayments.com',\
							WWW: 'https://www.balancedpayments.com',\
							DOCS: 'https://docs.balancedpayments.com',\
							DEBUG: false,\
							MIXPANEL: '991598fc644dd5d0894e6cb070154330',\
							GOOGLE_ANALYTICS: 'UA-30733850-1'\
						}\
					}"
				},
				output: 'build/prod.html'
			}
		},

		hashres: {
			options: {
				fileNameFormat: '${name}-${hash}.${ext}'
			},
			css: {
				src: ['build/css/*.css'],
				dest: ['build/dev.html', 'build/prod.html', 'build/test/runner.html', 'build/test/fixturebrowser.html', 'dist/*.html']
			},
			js: {
				src: ['dist/js/dashboard-prod.js', 'dist/js/dashboard-prod.min.js', 'dist/js/lib-prod.js', 'dist/js/lib-prod.min.js'],
				dest: ['build/dev.html', 'build/prod.html', 'build/test/runner.html', 'build/test/fixturebrowser.html', 'dist/js/*.map.js']
			},
			jsSourceMaps: {
				src: ['dist/js/dashboard.map.js', 'dist/js/lib.map.js'],
				dest: ['dist/js/*']
			},
			images: {
				src: ['build/images/**/*.png'],
				dest: ['build/dev.html', 'build/prod.html', 'build/css/*.css', 'build/js/*.js', 'dist/js/*.js']
			},
			fonts: {
				src: ['build/fonts/**/*'],
				dest: ['build/dev.html', 'build/prod.html', 'build/css/*.css', 'build/js/*.js', 'dist/js/*.js']
			}
		},

		img: {
			// using only dirs with output path
			crush_them: {
				src: ['build/images/**/*.png']
			}
		},

		s3: {
			options: {
				access: 'public-read',
				region: 'us-west-1',
				gzip: true,
				headers: {
					'X-Employment': 'aXdhbnR0b21ha2VhZGlmZmVyZW5jZStobkBiYWxhbmNlZHBheW1lbnRzLmNvbQ=='
				}
			},
			previewCached: {
				options: {
					bucket: 'balanced-dashboard-preview',
				},
				headers: {
					'Cache-Control': 'public, max-age=86400'
				},
				upload: [{
					src: 'dist/js/*',
					dest: 'js/'
				}, {
					src: 'dist/css/*',
					dest: 'css/'
				}, {
					src: 'dist/images/**/*',
					dest: 'images/'
				}, {
					src: 'dist/fonts/**/*',
					dest: 'fonts/'
				}]
			},
			previewUncached: {
				options: {
					bucket: 'balanced-dashboard-preview',
				},
				headers: {
					'Cache-Control': 'max-age=60'
				},
				upload: [{
					src: 'dist/*',
					dest: ''
				}]
			},
			productionCached: {
				options: {
					bucket: 'balanced-dashboard',
				},
				headers: {
					'Cache-Control': 'public, max-age=86400'
				},
				upload: [{
					src: 'dist/js/*',
					dest: 'js/'
				}, {
					src: 'dist/css/*',
					dest: 'css/'
				}, {
					src: 'dist/images/**/*',
					dest: 'images/'
				}, {
					src: 'dist/fonts/**/*',
					dest: 'fonts/'
				}]
			},
			productionUncached: {
				options: {
					bucket: 'balanced-dashboard',
				},
				headers: {
					'Cache-Control': 'max-age=60'
				},
				upload: [{
					src: 'dist/*',
					dest: ''
				}]
			},
		},

		/*
		Reads the projects .jshintrc file and applies coding
		standards. Doesn't lint the dependencies or test
		support files.
		*/
		jshint: {
			all: [
				'Gruntfile.js',
				'app/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			},
			test: {
				files: {
					src: [
						'test/**/*.js',
						'!test/support/lib/*.*',
						'!test/support/*.js'
					],
				},
				options: {
					jshintrc: 'test/.jshintrc'
				}
			}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},

		jsbeautifier: {
			options: {
				config: '.jsbeautifyrc'
			},
			verify: {
				options: {
					mode: 'VERIFY_ONLY'
				},
				src: [
					'Gruntfile.js',
					'app/**/*.js',
					'test/**/*.js',
					'!test/support/lib/*.js',
					'bower.json',
					'karma.conf.js',
					'package.json',
					'npm-shrinkwrap.json'
				],
			},
			update: {
				options: {
					mode: 'VERIFY_AND_WRITE'
				},
				src: [
					'Gruntfile.js',
					'app/**/*.js',
					'test/**/*.js',
					'!test/support/lib/*.js',
					'bower.json',
					'karma.conf.js',
					'package.json',
					'npm-shrinkwrap.json'
				],
			}
		},

		connect: {
			server: {
				options: {
					port: 9876,
					base: '.'
				}
			}
		},

		watch: {
			templates: {
				files: [
					'app/**/*.hbs'
				],
				tasks: ['_buildJS'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: [
					'app/**/*.js',
					'static/lib/**/*.js'
				],
				tasks: ['_buildJSAfterTemplates'],
				options: {
					livereload: true,
				}
			},
			tests: {
				files: [
					'test/support/**/*',
					'test/**/*.js'
				],
				tasks: ['_buildTests'],
				options: {
					livereload: true,
				}
			},
			css: {
				files: [
					'static/less/*'
				],
				tasks: ['_buildCSS'],
				options: {
					livereload: true,
				}
			},
			images: {
				files: [
					'static/images/**/*'
				],
				tasks: ['_buildImages'],
				options: {
					livereload: true,
				}
			},
			fonts: {
				files: [
					'static/fonts/**/*'
				],
				tasks: ['_buildFonts'],
				options: {
					livereload: true,
				}
			},
			html: {
				files: [
					'app/index.html.hbs'
				],
				tasks: ['_buildHTML'],
				options: {
					livereload: true,
				}
			}
		},

		open: {
			dev: {
				path: 'http://localhost:9876/build/dev.html'
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-neuter');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-ember-templates');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-hashres');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-s3');
	grunt.loadNpmTasks('grunt-img');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-compile-handlebars');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-jsbeautifier');

	grunt.registerMultiTask('clean', 'Deletes files', function() {
		this.files.forEach(function(file) {
			file.orig.src.forEach(function(f) {
				if (grunt.file.exists(f)) {
					grunt.file.delete(f);
				}
			});
		});
	});

	/*
	A task to run the application's unit tests via the command line.
	It will headlessy load the test runner page and print the test runner results
	*/
	grunt.registerTask('test', ['_devBuild', 'karma', 'jshint', 'verify']);

	/*
	Default task. Compiles templates, neuters application code, and begins
	watching for changes.
	*/
	grunt.registerTask('default', ['_devBuild', 'connect', 'open', 'watch']);

	/*
	Builds for production.
	*/
	grunt.registerTask('build', ['jshint', '_devBuild', '_prodBuildSteps']);

	grunt.registerTask('format', ['jsbeautifier:update']);
	grunt.registerTask('verify', ['jshint', 'jsbeautifier:verify']);

	/*
	Uploads to s3. Requires environment variables to be set if the bucket
	you're uploading to doesn't have public write access.
	*/
	grunt.registerTask('deploy', ['build', 's3:productionCached', 's3:productionUncached']);
	grunt.registerTask('deployPreview', ['build', 's3:previewCached', 's3:previewUncached']);

	grunt.registerTask('_devBuild', ['clean', '_buildJS', '_buildTests', '_buildCSS', '_buildImages', '_buildFonts', '_buildHTML']);

	grunt.registerTask('_uglify', ['copy:preUglify', 'uglify', 'copy:postUglify']);

	// keeping these steps out of the normal build because
	// uglify) Uglifying takes forever
	// img) Img task has dependencies that must be installed, so trying to ease the pain for new devs
	// hashres) Hashes depend on image bytes, so need to crush the images before running this
	grunt.registerTask('_prodBuildSteps', ['img', '_uglify', 'hashres', 'copy:dist']);

	grunt.registerTask('_buildJS', ['emberTemplates', '_buildJSAfterTemplates']);
	grunt.registerTask('_buildJSAfterTemplates', ['bower:install', 'neuter:dev', 'neuter:prod', 'concat:dashboarddev', 'concat:dashboardprod', 'concat:libdev', 'concat:libprod']);
	grunt.registerTask('_buildTests', ['neuter:testfixtures', 'concat:tests', 'copy:test']);
	grunt.registerTask('_buildCSS', ['less']);
	grunt.registerTask('_buildImages', ['copy:images']);
	grunt.registerTask('_buildFonts', ['copy:fonts']);
	grunt.registerTask('_buildHTML', ['compile-handlebars']);
};
