Balanced.ApplicationController = Ember.Controller.extend({
    signOut: function () {
        Balanced.Auth.signOut();
        var self = this;
        Balanced.Auth.on('signOutSuccess', function () {
            self.transitionToRoute('index');
        });
    }
});
