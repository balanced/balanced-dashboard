Balanced.AccountsIndexRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id + "?embedded=1";
  }
});

Balanced.AccountsCreditRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id +  "/credits/" + params.credit_id + "?embedded=1";
  }
});

Balanced.AccountsDebitRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id +  "/debits/" + params.debit_id + "?embedded=1";
  }
});

Balanced.AccountsRefundRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id +  "/refunds/" + params.refund_id + "?embedded=1";
  }
});

Balanced.AccountsHoldRoute = Balanced.AuthRoute.extend({
  model: function(params) {
    var marketplace = this.modelFor('marketplace');
    return marketplace.get('web_uri') + "/accounts/" + params.account_id +  "/holds/" + params.hold_id + "?embedded=1";
  }
});

////
// Aliases
//
// These are not quite working yet. Still need to be fixed.
////
Balanced.MarketplaceCreditsRoute = Balanced.AuthRoute.extend({
  redirect: function () {
    this.transitionTo('accounts.credit');
  }
});

Balanced.MarketplaceDebitsRoute = Balanced.AuthRoute.extend({
  redirect: function () {
    this.transitionTo('accounts.debit');
  }
});

Balanced.MarketplaceRefundsRoute = Balanced.AuthRoute.extend({
  redirect: function () {
    this.transitionTo('accounts.refund');
  }
});

Balanced.MarketplaceHoldsRoute = Balanced.AuthRoute.extend({
  redirect: function () {
    this.transitionTo('accounts.hold');
  }
});