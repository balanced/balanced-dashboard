$(window).load(function(){

QUnit.testStart(function () {
    // Put the application into a known state, and destroy the defaultStore.
    // Be careful about DS.Model instances stored in App; they'll be invalid
    // after this.
    // This is broken in some versions of Ember and Ember Data, see:
    // https://github.com/emberjs/data/issues/847
    Ember.run(function () { Balanced.reset(); });

    // Set up Ember Auth
    Ember.run(function () {
        Auth.set('authToken', "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987");
        Auth.set('currentUserId', "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987");
        Auth.set('currentUser', Balanced.User.find(Auth.currentUserId));
    });

    // Display an error if asynchronous operations are queued outside of
    // Ember.run.  You need this if you want to stay sane.
    Ember.testing = true;
});

QUnit.testDone(function () {
    Ember.testing = false;
});

// TODO - do we need this?

// Load associations immediately, instead of waiting for FixtureAdapter's
// asynchronous loads.  Basically, all we need to do is access each object
// from inside Ember.run.
// TODO: We can't test this or insert where needed until App.reset() works.
// TODO: Handle hasMany.
function loadAssociations(object /*, paths... */) {
    var paths = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < paths.length; i++) {
        var components = paths[i].split(".");
        for (var j = 0; j < components.length; j++) {
            Ember.run(function () {
                var path = components.slice(0, j+1).join(".");
                object.get(path);
            });
        }
    }
}

});
