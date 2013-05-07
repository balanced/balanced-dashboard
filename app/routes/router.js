Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Auth.Route.extend({
});

Balanced.Router.map(function () {
  this.resource("marketplace", { path: "/marketplaces/:marketplace_id" }, function() {
    this.route("activity", { path: "/activity" });
    this.route("invoices", { path: "/invoices" });
    this.route("logs", { path: "/logs" });

    this.route("credits", { path: "/credits/:credit_id"});
    this.route("debits", { path: "/debits/:debit_id"});
    this.route("refunds", { path: "/refunds/:refund_id"});
    this.route("holds", { path: "/holds/:hold_id"});

    this.resource("account", { path: "/accounts/:account_id"}, function() {
      this.route("credits", { path: "/credits/:credit_id"});
    });
    this.route("transactions", { path: "/transactions/:transaction_id"});
  });
  this.resource('login');
  this.resource('forgot-password');
});

require('app/routes/application');
require('app/routes/index');

require('app/routes/marketplace');
require('app/routes/account');

require('app/routes/marketplace_credits');
require('app/routes/marketplace_debits');
require('app/routes/marketplace_refunds');
require('app/routes/marketplace_holds');

require('app/routes/marketplace_transactions');
require('app/routes/marketplace_logs');
