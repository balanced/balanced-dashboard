/* global require, module */

var pickFiles = require('broccoli-static-compiler');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var mergeTree = require('broccoli-merge-trees');

var app = new EmberApp();

app.import("bower_components/jquery.cookie/jquery.cookie.js");
app.import("bower_components/timepicker/jquery.timepicker.js");
app.import("bower_components/lodash/dist/lodash.js");
app.import("bower_components/moment/moment.js");
app.import("bower_components/shapeshifter/shapeshifter.js");
app.import('bower_components/mixpanel/mixpanel.js');
app.import('bower_components/google-code-prettify/src/prettify.js');

app.import('bower_components/bootstrap/js/bootstrap-dropdown.js');
app.import('bower_components/bootstrap/js/bootstrap-modal.js');
app.import('bower_components/bootstrap/js/bootstrap-tooltip.js');
app.import('bower_components/bootstrap/js/bootstrap-popover.js');

app.import("bower_components/bootstrap-daterangepicker/daterangepicker.js");

app.import("vendor/ember-validations.prod.js");
app.import('vendor/moment-business-days.js');

var fonts = pickFiles('bower_components/strapped/static/fonts', {
	srcDir: '/',
	files: ['*.eot', '*.svg', '*.ttf', '*.woff'],
	destDir: '/assets/fonts'
});

var images = pickFiles('bower_components/strapped/static/images', {
	srcDir: '/',
	files: ['**/*.png', '**/*.gif'],
	destDir: '/assets/images'
});

var qunitBdd = pickFiles('bower_components/sinon/', {
	srcDir: '/',
	files: ['index.js'],
	destDir: '/assets'
});

module.exports = app.toTree(mergeTree([fonts, images, qunitBdd]));
