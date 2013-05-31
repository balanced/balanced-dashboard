Balanced.MarketplaceTransactionsRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    return this.modelFor('marketplace');
  }
});
