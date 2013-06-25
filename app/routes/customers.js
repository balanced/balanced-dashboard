Balanced.CustomersIndexRoute = Balanced.AuthRoute.extend({
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
