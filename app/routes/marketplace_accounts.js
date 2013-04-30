Balanced.MarketplaceAccountsRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    var accountURI = marketplace.get('uri') + "/accounts/" + params.account_id;
    return Balanced.Account.find(accountURI);
  }
});
