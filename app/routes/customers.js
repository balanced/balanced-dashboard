Balanced.CustomersRoute = Balanced.AuthRoute.extend({
});

Balanced.CustomerRoute = Balanced.AuthRoute.extend({
    model: function (params) {
        var customerURI = Balanced.Customer.constructUri(params.customer_id);
        return Balanced.Customer.find(customerURI);
    }
});
