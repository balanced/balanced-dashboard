Balanced.ApplicationController = Ember.Controller.extend({
  signOut: function() {
    Auth.signOut();
    var self=this;
    Auth.on('signOutSuccess', function() {
      self.transitionToRoute('index');
    });
  }
});
