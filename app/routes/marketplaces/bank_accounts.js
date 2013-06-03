Balanced.BankAccountsBankAccountRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + '/bank_accounts/' + params.bank_account_id + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND;
  }
});
