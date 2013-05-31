Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

Balanced.Router.map(function () {
    this.resource('marketplaces', {path: '/marketplaces'}, function () {
        this.resource("marketplace", { path: "/:marketplace_id" }, function () {
            this.route("transactions", { path: "/transactions" });

            this.resource("accounts", { path: "/accounts/:account_id" }, function () {
                this.route("credit", { path: "/credits/:credit_id" });
                this.route("debit", { path: "/debits/:debit_id" });
                this.route("refund", { path: "/refunds/:refund_id" });
                this.route("hold", { path: "/holds/:hold_id" });

                this.resource("cards", { path: "/cards" }, function () {
                    this.route("card", { path: "/:card_id" });
                });

                this.resource("bankAccounts", { path: "/bank_accounts" }, function () {
                    this.route("bankAccount", { path: "/:bank_account_id" });
                });
            });

            ////
            // Aliases, they simply transitionTo
            ////
            this.route("credits", { path: "/credits/:credit_id" });
            this.route("debits", { path: "/debits/:debit_id" });
            this.route("refunds", { path: "/refunds/:refund_id" });
            this.route("holds", { path: "/holds/:hold_id" });

            this.resource("logs", { path: "/logs" }, function () {
                this.route("log", { path: "/:log_id" });
            });

            this.resource("invoices", { path: "/invoices" }, function () {
                this.route("invoice", { path: "/:invoice_id" });
            });

            this.resource("cards", { path: "/cards" }, function () {
                this.route("card", { path: "/:card_id" });
            });

            this.resource("bankAccounts", { path: "/bank_accounts" }, function () {
                this.route("bankAccount", { path: "/:bank_account_id" });
            });
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

require('app/routes/marketplace_accounts');
require('app/routes/marketplace_index');
require('app/routes/marketplace_transactions');
require('app/routes/marketplace_logs');
require('app/routes/marketplace_invoices');
require('app/routes/marketplace_cards');
require('app/routes/marketplace_bankaccounts');
