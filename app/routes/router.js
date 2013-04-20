Balanced.Route = Ember.Route.extend({

});

Balanced.Router.map(function () {
  this.resource("marketplace", { path: "/marketplaces/:marketplace_id" });
  this.resource('login');
});

Balanced.ApplicationRoute = Ember.Route.extend({
  setupController: function() {
    this.controllerFor('marketplaces').set('model', Balanced.Marketplace.find());
  }
});
