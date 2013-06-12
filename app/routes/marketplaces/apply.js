Balanced.MarketplacesApplyRoute = Balanced.AuthRoute.extend({
    title: 'Apply for production access',
    model: function () {
        var request = Balanced.ProductionAccessRequest.create({

        });
        return {
            request: request,
            title: this.title
        };
    },
    setupController: function (controller, model) {
        this._super(controller, model.request);
        this.controllerFor('marketplace').set('content', null);
    },
    events: {
        signup: function (model) {

        }
    }
});
