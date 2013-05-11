Balanced.BankaccountsBankaccountRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/bank_accounts/" + params.bankaccount_id + "?embedded=1";
  }
});