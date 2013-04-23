Balanced.Route = Ember.Route.extend({

});

Balanced.Router.map(function () {
  this.resource("marketplace", { path: "/marketplaces/:marketplace_id" }, function() {
    this.route("activity", { path: "/activity" });
    this.route("invoices", { path: "/invoices" });
    this.route("logs", { path: "/logs" });

    this.route("credits", { path: "/credits/:credit_id"});
  });
  this.resource('login');
});

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

Balanced.MarketplaceCreditsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    // TODO - should be finding the real one, not creating it.
    var credit = Balanced.Credit.createRecord({
      id: params.credit_id,
      marketplace: marketplace
    });
    return credit;
  }
});
