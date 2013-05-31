Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

function makeNestedResource(that, plural, singular) {
    that.resource(plural, { path: '/' + plural }, function () {
        this.route(singular, { path: '/' + singular });
    });
}

function bankAccountsResource(that) {
    that.resource("bankAccounts", { path: "/bank_accounts" }, function () {
        that.route("bankAccount", { path: "/:bank_account_id" });
    });
}

Balanced.Router.map(function () {
    this.resource('marketplaces', {path: '/marketplaces'}, function () {
        this.resource("marketplace", { path: "/:marketplace_id" }, function () {
            this.route("transactions", { path: "/transactions" });

            this.resource("accounts", { path: "/accounts/:account_id" }, function () {

                makeNestedResource(this, 'credits', 'credit');
                makeNestedResource(this, 'debits', 'debit');
                makeNestedResource(this, 'refunds', 'refund');
                makeNestedResource(this, 'holds', 'hold');
                makeNestedResource(this, 'cards', 'card');
                bankAccountsResource(this);
            });

            ////
            // Aliases, they simply transitionTo
            ////
            makeNestedResource(this, 'credits', 'credit');
            makeNestedResource(this, 'debits', 'debit');
            makeNestedResource(this, 'refunds', 'refund');
            makeNestedResource(this, 'holds', 'hold');
            makeNestedResource(this, 'cards', 'card');
            makeNestedResource(this, 'logs', 'log');
            makeNestedResource(this, 'invoices', 'invoice');
            bankAccountsResource(this);
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
require('app/routes/marketplace_logs');
require('app/routes/marketplace_invoices');
require('app/routes/marketplace_cards');
require('app/routes/marketplace_bank_accounts');
