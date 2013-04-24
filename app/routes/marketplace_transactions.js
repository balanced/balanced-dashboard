Balanced.MarketplaceTransactionsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/transactions/" + params.transaction_id + "?embedded=1";
  }
});
