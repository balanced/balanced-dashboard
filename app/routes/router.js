Balanced.Route = Ember.Route.extend({
});

Balanced.Router.reopenClass({
    defaultFailureHandler: {
        setup: function (error) {
            Ember.Logger.error('Error while loading route:', error);

            // Using setTimeout allows us to escape from the Promise's try/catch block
            setTimeout(function () {
                Balanced.Router.router.transitionTo('login');
            });
        }
    }
});

Balanced.AuthRoute = Ember.Route.extend(Balanced.Auth.AuthRedirectable, {
});

function makeNestedResource(that, plural, singular) {
    that.resource(plural, { path: '/' + plural }, function () {
        this.route(singular, { path: '/:' + singular + '_id' });
    });
}

Balanced.Router.map(function () {

    this.resource('marketplaces', { path: '/marketplaces' }, function () {

        this.route('apply', { path: '/apply' });

        this.resource('marketplace', { path: '/:marketplace_id' }, function () {

            this.resource('accounts', { path: '/accounts' }, function () {

                this.route('new', { path: '/new' });

                this.resource('account', { path: '/:account_id' }, function () {

                    makeNestedResource(this, 'cards', 'card');
                    makeNestedResource(this, 'credits', 'credit');
                    makeNestedResource(this, 'debits', 'debit');
                    makeNestedResource(this, 'holds', 'hold');
                    makeNestedResource(this, 'refunds', 'refund');
                    makeNestedResource(this, 'bank_accounts', 'bank_account');
                    makeNestedResource(this, 'transactions', 'transaction');

                });

            });

            this.route('transactions', { path: '/transactions' });
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
    this.route('login', { path: '/login' });
    this.route('forgotPassword', { path: '/forgot_password' });
});

Balanced.IframeRoute = Balanced.AuthRoute.extend({
    param: null,
    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        var uri = marketplace.get('web_uri') + '/' + this.resource;
        if (this.param && params[this.param]) {
            uri += '/' + params[this.param];
        }
        return {
            'uri': uri + Balanced.MigrationUtils.EMBEDDED_QUERY_APPEND,
            'title': this.title,
            'marketplace': marketplace
        };
    },
    renderTemplate: function () {
        this.render('iframe');
    }
});

Balanced.ShowResource = Balanced.IframeRoute.extend({
    setupController: function (controller, model) {
        controller.set('model', model);
        this.controllerFor(this.resource).set('content', model);
    }
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
