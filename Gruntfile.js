/*jshint camelcase: false */
/*global module:false */
module.exports = function (grunt) {

    grunt.initConfig({
        // uglify: {
        //   'dist/built.min.js': 'dist/built.js'
        // },

        /*
         A simple ordered concatenation strategy.
         This will start at app/app.js and begin
         adding dependencies in the correct order
         writing their string contents into
         'build/application.js'

         Additionally it will wrap them in evals
         with @ sourceURL statements so errors, log
         statements and debugging will reference
         the source files by line number.

         You would set this option to false for
         production.
         */
        neuter: {
            dev: {
                options: {
                    includeSourceURL: true
                },
                src: ['app/dashboard.js'],
                dest: 'build/dashboard-dev.js'
            },
            prod: {
                src: ['app/dashboard.js'],
                dest: 'build/dashboard-prod.js'
            }
        },

        concat: {
            options: {
                separator: ';\n'
            },
            libdev: {
                src: [
                    'static/lib/jquery-1.9.1.js',
                    'static/lib/handlebars.runtime-1.0.0-rc.3.js',
                    'static/lib/ember-1.0.0-rc.3.js',
                    'static/lib/ember-data.js',
                    'static/lib/ember-auth.js',
                    'static/lib/bootstrap/bootstrap-dropdown.js',
                    'static/lib/bootstrap/bootstrap-modal.js',
                    'static/lib/bootstrap-datepicker.js',
                    'static/lib/jquery.browser.js',
                    'static/lib/jquery.iframe-auto-height.plugin.1.9.1.js'
                ],
                dest: 'build/lib-dev.js'
            },
            libprod: {
                src: [
                    'static/lib/jquery-1.9.1.js',
                    'static/lib/handlebars.runtime-1.0.0-rc.3.js',
                    'static/lib/ember-1.0.0-rc.3.min.js',
                    'static/lib/ember-data.prod.js',
                    'static/lib/ember-auth.min.js',
                    'static/lib/bootstrap/bootstrap-dropdown.js',
                    'static/lib/bootstrap/bootstrap-modal.js',
                    'static/lib/bootstrap-datepicker.js',
                    'static/lib/jquery.browser.js',
                    'static/lib/jquery.iframe-auto-height.plugin.1.9.1.min.js'
                ],
                dest: 'build/lib-prod.js'
            },
            testfixtures: {
                src: [
                    'test/support/fixtures/**/*.js'
                ],
                dest: 'build/test-fixtures.js'
            },
            tests: {
                src: [
                    'test/unit/**/*.js',
                    'test/integration/**/*.js'
                ],
                dest: 'build/tests.js'
            }
        },

        uglify: {
            dashboard: {
                files: {
                    'dist/js/dashboard-prod.min.js': [
                        'build/dashboard-prod.js'
                    ]
                }
            },
            lib: {
                files: {
                    'dist/js/lib-prod.min.js': [
                        'build/lib-prod.js'
                    ]
                }
            }
        },

        /*
         Watch files for changes.

         Changes in static/lib/ember.js or application javascript
         will trigger the neuter task.

         Changes to any templates will trigger the ember_templates
         task (which writes a new compiled file into build/)
         and then neuter all the files again.
         */
        watch: {
            application_code: {
                files: [
                    'static/lib/**/*.js',
                    'app/**/*.js'
                ],
                tasks: ['neuter', 'concat']
            },
            tests: {
                files: [
                    'test/support/runner.html.tmpl',
                    'test/**/*.js'
                ],
                tasks: ['concat']
            },
            handlebars_templates: {
                files: ['app/**/*.hbs'],
                tasks: ['ember_templates', 'neuter', 'concat']
            },
            less: {
                files: ['static/less/*'],
                tasks: ['less']
            }
        },

        /*
         Runs all .html files found in the test/ directory through PhantomJS.
         Prints the report in your terminal.
         */
        qunit: {
            options: {
                '--web-security': 'no',
                coverage: {
                    src: ['build/dashboard-prod.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'report/coverage',
                    coberturaReport: 'report/',
                    linesThresholdPct: 45,
                    statementsThresholdPct: 45,
                    functionsThresholdPct: 45,
                    branchesThresholdPct: 15
                }
            },
            all: ['build/test/**/*.html']
        },

        /*
         Reads the projects .jshintrc file and applies coding
         standards. Doesn't lint the dependencies or test
         support files.
         */
        jshint: {
            all: [
                'Gruntfile.js',
                'app/**/*.js',
                'test/**/*.js',
                '!static/lib/*.*',
                '!test/support/lib/*.*',
                '!test/support/testconfig.js'
            ],
            options: {
                jshintrc: '.jshintrc'
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
        ember_templates: {
            options: {
                templateName: function (sourceFile) {
                    return sourceFile.replace(/app\/templates\//, '');
                }
            },
            'build/compiled/templates.js': ["app/templates/**/*.hbs"]
        },

        less: {
            development: {
                options: {
                    paths: ["assets/css"]
                },
                files: {
                    "build/css/base.css": "static/less/base.less"
                }
            },
            production: {
                options: {
                    paths: ["assets/css"],
                    yuicompress: true
                },
                files: {
                    "build/css/base.min.css": "static/less/base.less"
                }
            }
        },

        /*
         * A test server used for casperjs tests
         * */
        connect: {
            server: {
                options: {
                    port: 9876,
                    base: '.'
                }
            }
        },

        casperjs: {
            options: {
                // Task-specific options go here.
            },
            files: ['test/casperjs/**/*.js']
        },

        copy: {
            html: {
                files: [
                    {
                        src: ['prod.html'],
                        dest: 'dist/index.html'
                    }
                ]
            },
            css: {
                files: [
                    {
                        cwd: 'build/css/',
                        expand: true,
                        src: ['**'],
                        dest: 'dist/css/'
                    }
                ]
            },
            test: {
                files: [
                    {
                        cwd: 'test/support/static/',
                        expand: true,
                        src: ['**'],
                        dest: 'build/test/'
                    },
                    {
                        cwd: 'test/support/lib/',
                        expand: true,
                        src: ['**'],
                        dest: 'build/test/js'
                    },
                    {
                        src: 'test/support/testconfig.js',
                        dest: 'build/test/js/testconfig.js'
                    }
                ]
            }
        },

        hashres: {
            options: {
                fileNameFormat: '${name}-${hash}.${ext}'
            },
            css: {
                src: ['dist/**/*.js', 'dist/**/*.css'],
                dest: 'dist/index.html'
            }
        },

        clean: {
            files: {
                src: ['build/', 'dist/', 'report/']
            }
        },

        s3: {
            options: {
                bucket: 'balanced-dashboard',
                access: 'public-read',
                region: 'us-west-1',
                gzip: true,
                headers: {
                    'X-Employment': 'aXdhbnR0b21ha2VhZGlmZmVyZW5jZStobkBiYWxhbmNlZHBheW1lbnRzLmNvbQ=='
                }
            },
            cached: {
                headers: {
                    'Cache-Control': 'public, max-age=86400'
                },
                upload: [
                    {
                        src: 'dist/js/*',
                        dest: 'js/'
                    },
                    {
                        src: 'dist/css/*',
                        dest: 'css/'
                    },
                    {
                        src: 'static/images/**/*',
                        dest: 'images/'
                    }
                ]
            },
            not_cached: {
                headers: {
                    'Cache-Control': 'max-age=60'
                },
                upload: [
                    {
                        src: 'dist/*',
                        dest: ''
                    }
                ]
            }
        },

        img: {
            // using only dirs with output path
            crush_them: {
                src: ['static/images/**/*.png']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-neuter');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-casperjs');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-hashres');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-s3');
    grunt.loadNpmTasks('grunt-img');
    grunt.loadNpmTasks('grunt-qunit-istanbul');

    grunt.registerMultiTask('clean', 'Deletes files', function () {
        this.files.forEach(function (file) {
            file.orig.src.forEach(function (f) {
                if (grunt.file.exists(f)) {
                    grunt.file.delete(f);
                }
            });
        });
    });


    /*
     A task to run the application's unit tests via the command line.
     It will
     - convert all the handlebars templates into compile functions
     - combine these files + application files in order
     - lint the result
     - build an html file with a script tag for each test file
     - headlessy load this page and print the test runner results
     */
    grunt.registerTask('test', ['ember_templates', 'neuter', 'concat', 'jshint', 'copy', 'qunit']);
    grunt.registerTask('itest', ['connect:server', 'casperjs']);

    /*
     Default task. Compiles templates, neuters application code, and begins
     watching for changes.
     */
    grunt.registerTask('default', ['ember_templates', 'neuter', 'concat', 'less', 'copy', 'watch']);

    /*
     Builds for production. Concatenates files together, minifies and then uploads to s3
     */
    grunt.registerTask('build', ['clean', 'ember_templates', 'neuter', 'concat', 'jshint', 'less', 'uglify', 'copy', 'hashres']);

    /*
     * This isn't run as part of the build to make it easier for people to hack
     * on the project as this requires optipng to be installed which is an
     * external dependency.
     */
    grunt.registerTask('optimize', ['img']);

    /*
     * Uploads to s3. Requires environment variables to be set if the bucket
     * you're uploading to doesn't have public write access.
     */
    grunt.registerTask('deploy', ['build', 'optimize', 's3']);
};
