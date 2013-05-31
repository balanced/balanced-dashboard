Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

function makeNestedResource(that, plural, singular) {
    that.resource(plural, { path: '/' + plural }, function () {
        this.route(singular, { path: '/' + singular + '_id' });
    });
}

function bankAccountsResource(that) {
    that.resource("bank_accounts", { path: "/bank_accounts" }, function () {
        this.route("bank_account", { path: "/:bank_account_id" });
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
require('app/routes/login');

require('app/routes/marketplaces/accounts');
require('app/routes/marketplaces/bank_accounts');
require('app/routes/marketplaces/cards');
require('app/routes/marketplaces/index');
require('app/routes/marketplaces/invoices');
require('app/routes/marketplaces/logs');
require('app/routes/marketplaces/show');
require('app/routes/marketplaces/transactions');
