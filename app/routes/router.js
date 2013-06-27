Balanced.Route = Ember.Route.extend({
});

Balanced.Router = Ember.Router.extend({
    didTransition: function (info) {
        Balanced.Analytics.trackPage(_.pluck(info, 'name').join('/'));
        return this._super.apply(this, arguments);
    }
});

Balanced.Router.reopenClass({
    defaultFailureHandler: {
        setup: function (error) {
            Ember.Logger.error('Error while loading route:', error);

            Balanced.Auth.trigger('authAccess');

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

            // only exists for compatibility with old dashboard URLs
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

            this.route('initial_deposit', { path: '/initial_deposit' });

            makeNestedResource(this, 'customers', 'customer');
            makeNestedResource(this, 'cards', 'card');
            makeNestedResource(this, 'credits', 'credit');
            makeNestedResource(this, 'debits', 'debit');
            makeNestedResource(this, 'holds', 'hold');
            makeNestedResource(this, 'invoices', 'invoice');
            makeNestedResource(this, 'logs', 'log');
            makeNestedResource(this, 'refunds', 'refund');

            this.resource('activity', { path: '/activity' }, function() {
                this.route('transactions', { path: '/transactions' });
                this.route('customers', { path: '/customers' });
                this.route('funding_instruments', { path: '/funding_instruments' });
            });

            this.resource('bank_accounts', { path: '/bank_accounts'}, function () {
                this.resource('bank_account', { path: '/:bank_account_id'}, function () {
                    this.route('transactions', { path: '/transactions'});
                });
            });
        });

    });

    // signup related
    this.route('login', { path: '/login' });
    this.route('forgotPassword', { path: '/forgot_password' });
    this.route('start', { path: '/start' });
    this.route('claim', { path: '/claim' });
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
            'uri': uri + Balanced.MigrationUtils.embeddedQueryString(),
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

require('app/routes/claim');
require('app/routes/login');
require('app/routes/start');

require('app/routes/marketplaces/accounts');
require('app/routes/marketplaces/apply');
require('app/routes/marketplaces/bank_accounts');
require('app/routes/marketplaces/funding_instruments');
require('app/routes/marketplaces/cards');
require('app/routes/marketplaces/index');
require('app/routes/marketplaces/initial_deposit');
require('app/routes/marketplaces/invoices');
require('app/routes/marketplaces/logs');
require('app/routes/marketplaces/show');
require('app/routes/marketplaces/transactions');
require('app/routes/marketplaces/activity');
require('app/routes/customers');
