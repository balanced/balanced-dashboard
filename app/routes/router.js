Balanced.Route = Ember.Route.extend({

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

    this.route("accounts", { path: "/accounts/:account_id"});
    this.route("transactions", { path: "/transactions/:transaction_id"});
  });
  this.resource('login');
});

require('app/routes/application');

require('app/routes/marketplace_credits');
require('app/routes/marketplace_debits');
require('app/routes/marketplace_refunds');
require('app/routes/marketplace_holds');

require('app/routes/marketplace_accounts');
require('app/routes/marketplace_transactions');
require('app/routes/marketplace_logs');
