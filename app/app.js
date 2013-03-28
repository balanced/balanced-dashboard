/*
 * Hey! This is an Ember application. It's built using a
 * neuter task (see this project's Gruntfile for what that means).
 *
 * `require`s in this file will be stripped and replaced with
 * the string contents of the file they refer to wrapped in
 * a closure.
 *
 * Each file contains its own commenting, so feel free to crack
 * them open if you want more information about what is going on.
 */

/*
 * These are the dependencies for an Ember application
 * and they have to be loaded before any application code.
 */
require('static/lib/jquery-1.9.1');

/*
 * Since we're precompiling our templates, we only need the
 * handlebars-runtime microlib instead of the
 * entire handlebars library and its string parsing functions.
 */
require('static/lib/handlebars.runtime-1.0.0-rc.3');

/* This is Ember. I think you'll like it */
require('static/lib/ember-1.0.0-rc.1');
require('static/lib/ember-data');


/*
 this file is generated as part of the build process.
 If you haven't run that yet, you won't see it.

 It is excluded from git commits since it's a
 generated file.
 */
require('build/compiled/templates');

/*
 Creates a new instance of an Ember application and
 specifies what HTML element inside index.html Ember
 should manage for you.
 */
window.Balanced = Ember.Application.create({
    rootElement: window.TESTING ? '#qunit-fixture' : '#balanced-app',
    LOG_TRANSITIONS: true
});

if (window.TESTING) {
    window.Balanced.deferReadiness();
}

/*
 * Helpers and utils - not static 3rd party libraries
 */
require('app/lib/helpers');

/*
 * Model layer.
 * Ember.Object itself provides most of what
 * model layers elsewhere provide. Since TodoMVC
 * doesn't communicate with a server, plain
 * Ember.Objects will do.
 */
require('app/models/auth');
require('app/models/marketplaces');


/*
 * Views layer.
 * You'll notice that there are only a few views.
 * Ember accomplishes a lot in its templates and
 * Views are only necessary if you have view-specific
 * programming to do.
 */
require('app/views/auth');

/*
 * Controller layer.
 * Controllers wrap objects and provide a place
 * to implement properties for display
 * whose value is computed from the content of the
 * controllers wrapped objects.
 */
require('app/controllers/marketplaces');
require('app/controllers/auth');

/*
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
 */
require('app/routes/router');
