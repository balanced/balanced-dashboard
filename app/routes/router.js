Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

Balanced.Router.map(function () {
  this.resource("marketplace", { path: "/marketplaces/:marketplace_id" }, function() {
    this.route("transactions", { path: "/transactions" });

    this.resource("logs", { path: "/logs" }, function() {
      this.route("log", { path: "/:log_id" });
    });

    this.resource("invoices", { path: "/invoices" }, function() {
      this.route("invoice", { path: "/:invoice_id" });
    });

    this.resource("cards", { path: "/cards" }, function() {
      this.route("card", { path: "/:card_id" });
    });

    this.resource("bankAccounts", { path: "/bank_accounts" }, function() {
      this.route("bankAccount", { path: "/:bankaccount_id" });
    });

    this.route("credits", { path: "/credits/:credit_id" });
    this.route("debits", { path: "/debits/:debit_id" });
    this.route("refunds", { path: "/refunds/:refund_id" });
    this.route("holds", { path: "/holds/:hold_id" });

    this.resource("account", { path: "/accounts/:account_id" }, function() {
      this.route("credits", { path: "/credits/:credit_id" });
    });
  });

  this.route('login', { path: "/login" });
  this.route('forgotPassword', { path: "/forgot_password" });
});

////
// Route requires
////
require('app/routes/application');
require('app/routes/index');
require('app/routes/marketplace');
require('app/routes/account');

require('app/routes/marketplace_logs');
require('app/routes/marketplace_invoices');
require('app/routes/marketplace_cards');
require('app/routes/marketplace_bankaccounts');

require('app/routes/marketplace_credits');
require('app/routes/marketplace_debits');
require('app/routes/marketplace_refunds');
require('app/routes/marketplace_holds');