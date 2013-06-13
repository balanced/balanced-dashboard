Balanced.CustomersIndexRoute = Balanced.AuthRoute.extend({
    model: function () {
        var marketplace = this.modelFor('marketplace');
        return marketplace;
    },

    events: {
      customerSelected: function(customer) {
        this.transitionTo("customers.customer", customer);
      }
    }
});
