Balanced.ApplicationRoute = Balanced.Route.extend({
  setupController: function(controller, model) {
    Ember.Instrumentation.subscribe("iframe.urlChanged", {
      before: function(name, timestamp, payload) {
        // forward the event to the application controller - see controllers/application.js
        controller.send('iframeUrlChanged', payload);
      },
      after: function() {}
    });
  }
});
