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
            options: {
                includeSourceURL: true
            },
            'build/application.js': 'app/app.js'
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
                    'static/lib/jquery-1.9.1.js',
                    'static/lib/ember-1.0.0-rc.1.js',
                    'static/lib/handlebars.runtime-1.0.0-rc.3.js',
                    'app/**/*.js'
                ],
                tasks: ['neuter']
            },
            handlebars_templates: {
                files: ['app/**/*.hbs'],
                tasks: ['ember_templates', 'neuter']
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
            all: ['test/**/*.html']
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
                '!test/support/*.*'
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
                    "build/css/base.css": "static/less/base.less"
                }
            }
        },

        /*
         Find all the <whatever>_test.js files in the test folder.
         These will get loaded via script tags when the task is run.
         This gets run as part of the larger 'test' task registered
         below.
         */
        build_test_runner_file: {
            all: ['test/**/*_test.js']
        }

    });

    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-neuter');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ember-templates');


    /*
     A task to build the test runner html file that get place in
     /test so it will be picked up by the qunit task. Will
     place a single <script> tag into the body for every file passed to
     its coniguration above in the grunt.initConfig above.
     */
    grunt.registerMultiTask('build_test_runner_file', 'Creates a test runner file.', function () {
        var tmpl = grunt.file.read('test/support/runner.html.tmpl');
        var renderingContext = {
            data: {
                files: this.filesSrc.map(function (fileSrc) {
                    return fileSrc.replace('test/', '');
                })
            }
        };
        grunt.file.write('test/runner.html', grunt.template.process(tmpl, renderingContext));
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
    grunt.registerTask('test', ['ember_templates', 'neuter', 'jshint', 'build_test_runner_file', 'qunit']);

    /*
     Default task. Compiles templates, neuters application code, and begins
     watching for changes.
     */
    grunt.registerTask('default', ['ember_templates', 'neuter', 'watch']);
};
