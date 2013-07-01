Balanced.ActivityIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.transactions');
    }
});

Balanced.ActivityTransactionsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        var transactions = marketplace.get('transactions');
        // HACK: never hard-code the cookie key directly, only doing this to
        // limit scope of migration changes
        var showWelcome = $.cookie('existing') && !$.cookie('suppressWelcome');
        marketplace.refresh();
        transactions.refresh();
        //  TODO: this is migration code, remove it after August 2013
        setTimeout(function () {
            $('#welcome-transition').modal('show');
        }, 100);
        return Ember.Object.create({
            marketplace: marketplace,
            showWelcome: showWelcome,
            transactions: transactions
        });
    },
    events: {
        hideWelcome: function () {
            $.cookie('suppressWelcome', 1);
            $.removeCookie('existing');
            $('#welcome-transition').modal('hide');
        },
        transactionSelected: function (transaction) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(transaction.uri);
        }
    }
});

Balanced.ActivityCustomersRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        marketplace.refresh();
        return marketplace;
    },

    events: {
        customerSelected: function (customer) {
            //  HACK: until we have a customers page implemented we need to use the account's iframe
            var marketplace = this.modelFor('marketplace');
            var location = '/marketplaces/{0}/accounts/{1}'.format(marketplace.get('id'), customer.get('id'));
            window.location.hash = '#' + location;
//            this.transitionTo('customers.customer', customer);
        }
    }
});

Balanced.ActivityFundingInstrumentsRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        marketplace.refresh();
        return marketplace;
    },
    events: {
        fundingInstrumentSelected: function (fundingInstrument) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(fundingInstrument.uri);
        }
    }
});
