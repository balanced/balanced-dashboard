Balanced.MarketplaceTransactionsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/transactions/" + params.transaction_id + "?embedded=1";
  }
});
