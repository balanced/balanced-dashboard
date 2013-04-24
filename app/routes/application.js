Balanced.ApplicationRoute = Balanced.Route.extend({
  setupController: function(controller, model) {
    this.controllerFor('marketplaces').set('model', Balanced.Marketplace.find());

    Ember.Instrumentation.subscribe("iframe.linkclicked", {
      before: function(name, timestamp, payload) {
        // forward the event to the application controller - see controllers/application.js
        controller.send('iframeLinkClicked', payload);
      },
      after: function() {}
    });
  }
});
