Balanced.Route = Ember.Route.extend({

});

Balanced.Router.map(function () {
    this.resource("marketplaces", function () {
        this.resource("marketplace", { path: ":marketplace_id" });
    });
    this.resource('login');
});

Balanced.MarketplacesIndexRoute = Balanced.Route.extend({
  model: function() {
    return Balanced.Marketplace.find();
  }
});
