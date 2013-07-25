Balanced.CustomersRoute = Balanced.AuthRoute.extend({
});

Balanced.CustomerRoute = Balanced.AuthRoute.extend({
    page_title: function (route, set_title) {
        var customer = route.controller.content;
        return Balanced.Utils.loadSetTitle(customer, set_title, function () {
            return 'Customer: loading ...'; 
        }, function () {
            var name;
            if (customer.is_business) {
                name = customer.business_name;
            } else {
                name = customer.name;
            }
            var title = 'Customer: {0}'.format(name);
            if (customer.email) {
                title += ' ({0})'.format(customer.email);
            }
            return title;
        });
    },

    model: function (params) {
        var marketplace = this.modelFor('marketplace');
        return marketplace.then(function(marketplace) {
            var customerUri = marketplace.get('customers_uri') + '/' + params.customer_id;
            return Balanced.Customer.find(customerUri);
        });
    }
});
