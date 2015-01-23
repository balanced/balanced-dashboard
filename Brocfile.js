/* global require, module */

var pickFiles = require('broccoli-static-compiler');
var mergeTree = require('broccoli-merge-trees');

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var app = new EmberApp();

app.import("bower_components/jquery.cookie/jquery.cookie.js");
app.import("bower_components/timepicker/jquery.timepicker.js");
app.import("bower_components/lodash/dist/lodash.js");
app.import("bower_components/moment/moment.js");
app.import("bower_components/shapeshifter/shapeshifter.js");
app.import('bower_components/mixpanel/mixpanel.js');
app.import('bower_components/google-code-prettify/src/prettify.js');

app.import('bower_components/strapped/static/js/bootstrap/dropdown.js');
app.import('bower_components/strapped/static/js/bootstrap/modal.js');
app.import('bower_components/strapped/static/js/bootstrap/tooltip.js');
app.import('bower_components/strapped/static/js/bootstrap/popover.js');

app.import("bower_components/jquery-csv/src/jquery.csv.js");
app.import("bower_components/formatter/dist/formatter.js");

app.import("vendor/daterangepicker.js");
app.import("vendor/ember-validations.prod.js");
app.import('vendor/moment-business-days.js');
app.import('bower_components/ember-shortcuts/ember-shortcuts.js');

var fonts = pickFiles('bower_components/strapped/static/fonts', {
	srcDir: '/',
	files: ['*.eot', '*.svg', '*.ttf', '*.woff'],
	destDir: '/fonts'
});

var images = pickFiles('bower_components/strapped/static/images', {
	srcDir: '/',
	files: ['**/*.png', '**/*.gif'],
	destDir: '/images'
});

var qunitBdd = pickFiles('bower_components/sinon/', {
	srcDir: '/',
	files: ['index.js'],
	destDir: '/assets'
});

module.exports = app.toTree(mergeTree([fonts, images, qunitBdd]));
