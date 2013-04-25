Balanced.ApplicationRoute = Balanced.Route.extend({
  setupController: function(controller, model) {
    Ember.Instrumentation.subscribe("iframe.linkclicked", {
      before: function(name, timestamp, payload) {
        // forward the event to the application controller - see controllers/application.js
        controller.send('iframeLinkClicked', payload);
      },
      after: function() {}
    });
  }
});
