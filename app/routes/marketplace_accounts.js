Balanced.MarketplaceAccountsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id + "?embedded=1";
  }
});
