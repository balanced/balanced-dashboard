/*
 this file is generated as part of the build process.
 If you haven't run that yet, you won't see it.

 It is excluded from git commits since it's a
 generated file.
 */
require('build/js/compiled-templates');

/*
 Creates a new instance of an Ember application and
 specifies what HTML element inside index.html Ember
 should manage for you.
 */
window.Balanced = Ember.Application.create({
    rootElement: window.TESTING ? '#qunit-fixture' : '#balanced-app',
    LOG_TRANSITIONS: true,

    customEvents: {
        // key is the jquery event, value is the name used in views
        changeDate: 'changeDate'
    }
});

if (window.TESTING) {
    Balanced.setupForTesting();
}

window.Balanced.onLoad = function () {
    //  initialize anything that needs to be done on application load
    Balanced.Helpers.init();
};

/*
 * Helpers and utils - not static 3rd party libraries
 */
require('app/lib/ajax');
require('app/lib/helpers');
require('app/lib/jquery-hotkeys');
require('app/lib/strftime');
require('app/lib/migration');
require('app/lib/variables');

/*
 * Model layer.
 * Ember.Object itself provides most of what
 * model layers elsewhere provide. Since TodoMVC
 * doesn't communicate with a server, plain
 * Ember.Objects will do.
 */
require('app/models/adapters/base');
require('app/models/adapters/ajax');
require('app/models/adapters/fixture');
require('app/models/adapter_config');
require('app/models/model');
require('app/models/marketplace_lite');
require('app/models/marketplace');
require('app/models/user');
require('app/models/account');
require('app/models/transaction');
require('app/models/credit');
require('app/models/debit');
require('app/models/hold');
require('app/models/refund');
require('app/models/funding_instrument');
require('app/models/search_query');
require('app/models/callback');
require('app/models/customer');

require('app/lib/auth');

/*
 * Views layer.
 * You'll notice that there are only a few views.
 * Ember accomplishes a lot in its templates and
 * Views are only necessary if you have view-specific
 * programming to do.
 */
require('app/views/_base');
require('app/views/login');
require('app/views/forgot_password');
require('app/views/embedded_iframe');
require('app/views/search');
require('app/views/date_picker');

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
require('app/controllers/marketplace_index');
require('app/controllers/login');
require('app/controllers/forgotPassword');
require('app/controllers/search');

require('app/controllers/accounts');
require('app/controllers/logs');
require('app/controllers/invoices');
require('app/controllers/cards');
require('app/controllers/bankAccounts');

/*
 * States (i.e. Routes)
 * Handles serialization of the application's current state
 * which results in view hierarchy updates. Responds to
 * actions.
 */
require('app/routes/router');


$(document).ready(window.Balanced.onLoad);
