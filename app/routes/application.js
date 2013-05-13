Balanced.ApplicationRoute = Balanced.Route.extend({
  events: {
    signOut: function () {
      Balanced.Auth.signOut();
      var self = this;
      Balanced.Auth.on('signOutSuccess', function () {
        self.transitionTo('index');
      });
    }
  }
});
