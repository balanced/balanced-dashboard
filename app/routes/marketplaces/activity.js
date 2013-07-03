Balanced.ActivityRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        marketplace.refresh();
        return marketplace;
    }
});

Balanced.ActivityIndexRoute = Balanced.AuthRoute.extend({
    redirect: function () {
        this.transitionTo('activity.transactions');
    }
});

Balanced.ActivityTransactionsRoute = Balanced.AuthRoute.extend({
    model: function () {
        // HACK: never hard-code the cookie key directly, only doing this to
        // limit scope of migration changes
        if ($.cookie('existing') && !$.cookie('suppressWelcome')) {
            setTimeout(function () {
                $('#welcome-transition').modal('show');
            }, 100);
        }

        var marketplace = this.modelFor('marketplace');
        marketplace.get('transactions').refresh();
        return marketplace;
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
        marketplace.get('customers').refresh();
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
        marketplace.get('funding_instruments').refresh();
        return marketplace;
    },
    events: {
        fundingInstrumentSelected: function (fundingInstrument) {
            window.location.hash = '#' + Balanced.Utils.uriToDashboardFragment(fundingInstrument.uri);
        }
    }
});
