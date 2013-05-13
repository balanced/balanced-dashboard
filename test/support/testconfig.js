$(window).load(function(){

QUnit.testStart(function () {

    // Display an error if asynchronous operations are queued outside of
    // Ember.run.  You need this if you want to stay sane.
    Ember.testing = true;
    Balanced.reset();

    // Set up Ember Auth
    Ember.run(function () {
        Balanced.Auth.set('authToken', "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987");
        Balanced.Auth.set('userId', "/users/USeb4a5d6ca6ed11e2bea6026ba7db2987");
        Balanced.Auth.set('signedIn', true);
        Balanced.Auth.set('user', Balanced.User.find(Balanced.Auth.userId));
    });
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
