Balanced.AccountRoute = Balanced.Route.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    var accountURI = marketplace.get('uri') + "/accounts/" + params.account_id;
    return Balanced.Account.find(accountURI);
  }
});

Balanced.AccountCreditsRoute = Balanced.Route.extend({
  model: function(params) {
    var account = this.modelFor('account');
    return Balanced.Credit.find(account.get('uri') + "/credits/" + params.credit_id);
  }
});
