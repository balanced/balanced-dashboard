Balanced.MarketplaceAddCustomerRoute = Balanced.AuthRoute.extend({
    pageTitle: 'Add a Customer',

    setupController: function (controller, model) {
        this._super(controller, model);
        controller.set('content', Balanced.Customer.create());
    }
});
