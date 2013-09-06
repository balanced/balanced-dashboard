QUnit.testStart(function (test) {
    var module = test.module ? test.module : '';
    console.log('#' + module + " " + test.name + ": starting setup.");

    // Display an error if asynchronous operations are queued outside of
    // Ember.run.  You need this if you want to stay sane.
    Ember.testing = true;

    //  we don't actually care about hitting a server
    Ember.ENV.BALANCED.WWW = 'http://example.org';

    Ember.$('<style>#ember-testing-container { position: absolute; background: white; bottom: 0; right: 0; width: 640px; height: 600px; overflow: auto; z-index: 9999; border: 1px solid #ccc; } #ember-testing { zoom: 50%; }</style>').appendTo('head');
    Ember.$('<div id="ember-testing-container"><div id="ember-testing"></div></div>').appendTo('body');

    Ember.run(function () {
        window.setupBalanced('#ember-testing');
        Balanced.Adapter = Balanced.FixtureAdapter.create();
        window.setupTestFixtures();

        Balanced.THROTTLE = 0;
        Balanced.setupForTesting();

    });

    // Set up Ember Auth
    Ember.run(function () {
        var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
        Balanced.Auth.setAuthProperties(
            true,
            Balanced.User.find(userId),
            userId,
            userId,
            false);
    });

    Ember.run(function() {
        window.Balanced.advanceReadiness();
    });

    Balanced.injectTestHelpers();

    window.Balanced.onLoad();

    // since we aren't using balanced.js, define its functions so we can stub them
    balanced = {};
    balanced.bankAccount = {
        validateRoutingNumber: function() {
            return true;
        },
        create: function() {
        }
    };
    balanced.card = {
        create: function() {
        }
    };

    console.log('%@ %@: setup complete. Starting test'.fmt(module, test.name));
});

QUnit.testDone(function (test) {
    var module = test.module ? test.module : '';
    console.log('#%@ %@: tearing down.'.fmt(module, test.name));

    Balanced.removeTestHelpers();
    Ember.$('#ember-testing-container, #ember-testing').remove();
    Ember.run(Balanced, Balanced.destroy);
    Balanced = null;

    Ember.testing = false;

    console.log('#%@ %@: done.'.fmt(module, test.name));
});
