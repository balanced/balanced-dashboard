Balanced.Route = Ember.Route.extend({
});

Balanced.Router = Ember.Router.extend({
    /*
     * This function update page title when a transition is made
     */
    _update_title: function (infos) {
        var last_info = infos[infos.length - 1];
        var title = last_info.handler.title;
        var route = last_info.handler;
        var page_title = route.get('pageTitle');

        // backup document title
        if (typeof this._doc_title === 'undefined') {
            this._doc_title = document.title;
        }

        var self = this;
        var set_title = function(title) {
            if (typeof title !== 'undefined') {
                document.title = self._doc_title + ' | ' + title;
            } else {
                document.title = self._doc_title;
            }
        };

        // try to call it if it is a function
        if (typeof page_title === 'function') {
            /*
             * The title may be updated by the page_title function later,
             * for example, ajax data loading page can update the title after the
             * data is loaded. So, you can return such as 'Customer: loading ...',
             * and call set_title('Customer: John') later when the data is loaded
             */
            page_title = page_title(route, set_title);
        }

        set_title(page_title);
    },

    didTransition: function (infos) {
        this._update_title(infos);
        Balanced.Analytics.trackPage(_.pluck(infos, 'name').join('/'));
        return this._super.apply(this, arguments);
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
            this.route('settings', { path: 'settings' });
            this.route('add_customer', { path: 'add_customer' });
            this.route('initial_deposit', { path: '/initial_deposit' });

            this.resource('activity', { path: '/activity' }, function () {
                this.route('transactions', { path: '/transactions' });
                this.route('customers', { path: '/customers' });
                this.route('funding_instruments', { path: '/funding_instruments' });
            });

            this.resource('customers', { path: '/customers/:customer_id' });
            // exists to handle old URIs for accounts, redirects to the customers page
            this.resource('accounts', { path: '/accounts/:account_id' });

            this.resource('bank_accounts', { path: '/bank_accounts/:bank_account_id'});

            this.resource('cards', { path: '/cards/:card_id'});

            this.resource('credits', { path: '/credits/:credit_id'});
            this.resource('reversals', { path: '/reversals/:reversal_id'});
            this.resource('debits', { path: '/debits/:debit_id'});
            this.resource('holds', { path: '/holds/:hold_id'});
            this.resource('refunds', { path: '/refunds/:refund_id'});

            makeNestedResource(this, 'logs', 'log');

            makeNestedResource(this, 'invoices', 'invoice');
        });

    });

    // signup related
    this.route('login', { path: '/login' });
    this.route('forgotPassword', { path: '/forgot_password' });
    this.route('resetPassword', { path: '/password/:token' });
    this.route('start', { path: '/start' });
    this.route('claim', { path: '/claim' });

    this.route("invalid", { path: "*:"});
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
            'id': params[this.param],
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
require('app/routes/forgot_password');
require('app/routes/reset_password');
require('app/routes/start');

require('app/routes/marketplaces/accounts');
require('app/routes/marketplaces/apply');
require('app/routes/marketplaces/index');
require('app/routes/marketplaces/initial_deposit');
require('app/routes/marketplaces/invoices');
require('app/routes/marketplaces/logs');
require('app/routes/marketplaces/marketplace');
require('app/routes/marketplaces/transactions');
require('app/routes/marketplaces/activity');
require('app/routes/marketplaces/settings');
require('app/routes/marketplaces/add_customer');
require('app/routes/customers');
require('app/routes/bank_accounts');
require('app/routes/cards');
require('app/routes/credits');
require('app/routes/debits');
require('app/routes/holds');
require('app/routes/refunds');
require('app/routes/reversals');
require('app/routes/accounts');
require('app/routes/invalid');