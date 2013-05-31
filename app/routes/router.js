Balanced.Route = Ember.Route.extend({
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

function makeNestedResource(that, plural, singular) {
    that.resource(plural, { path: '/' + plural }, function () {
        this.route(singular, { path: '/:' + singular + '_id' });
    });
}

Balanced.Router.map(function () {
    this.resource('marketplaces', {path: '/marketplaces'}, function () {
        this.resource("marketplace", { path: "/:marketplace_id" }, function () {
            this.route("transactions", { path: "/transactions" });

            this.resource("accounts", { path: "/accounts/:account_id" }, function () {

                makeNestedResource(this, 'cards', 'card');
                makeNestedResource(this, 'credits', 'credit');
                makeNestedResource(this, 'debits', 'debit');
                makeNestedResource(this, 'holds', 'hold');
                makeNestedResource(this, 'refunds', 'refund');
                makeNestedResource(this, 'bank_accounts', 'bank_account');
            });

            makeNestedResource(this, 'cards', 'card');
            makeNestedResource(this, 'credits', 'credit');
            makeNestedResource(this, 'debits', 'debit');
            makeNestedResource(this, 'holds', 'hold');
            makeNestedResource(this, 'invoices', 'invoice');
            makeNestedResource(this, 'logs', 'log');
            makeNestedResource(this, 'refunds', 'refund');
            makeNestedResource(this, 'bank_accounts', 'bank_account');
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
