Balanced.MarketplaceAccountsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return ENV.BALANCED.WWW + "/marketplaces/" + marketplace.get('id') + "/accounts/" + params.account_id + "?embedded=1";
  }
});
