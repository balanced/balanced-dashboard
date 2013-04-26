Balanced.ApplicationController = Ember.Controller.extend({
  iframeUrlChanged: function(context) {
    var transitionToDest = context.url;
    if(transitionToDest.indexOf('?') !== -1) {
      transitionToDest = transitionToDest.substring(0, transitionToDest.indexOf('?'));
    }

    if(transitionToDest !== '#') {
      window.location.hash = "#" + transitionToDest;
    }
  },

  signOut: function() {
    Auth.signOut();
    var self=this;
    Auth.on('signOutSuccess', function() {
      self.transitionToRoute('index');
    });
  },
});
