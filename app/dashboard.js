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
require('app/lib/ajax');
require('app/lib/helpers');
require('app/lib/migration');

/*
 * Model layer.
 * Ember.Object itself provides most of what
 * model layers elsewhere provide. Since TodoMVC
 * doesn't communicate with a server, plain
 * Ember.Objects will do.
 */
require('app/models/_base');
require('app/models/login');
require('app/models/marketplace');
require('app/models/credit');


/*
 * Views layer.
 * You'll notice that there are only a few views.
 * Ember accomplishes a lot in its templates and
 * Views are only necessary if you have view-specific
 * programming to do.
 */
require('app/views/_base');
require('app/views/login');
require('app/views/embedded_iframe');

/*
 * Controller layer.
 * Controllers wrap objects and provide a place
 * to implement properties for display
 * whose value is computed from the content of the
 * controllers wrapped objects.
 */
require('app/controllers/_base');
require('app/controllers/application');
require('app/controllers/marketplaces');
require('app/controllers/marketplace');
require('app/controllers/login');

/*
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
 */
require('app/routes/router');
