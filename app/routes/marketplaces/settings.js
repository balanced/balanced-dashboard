Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
    model: function (params) {
    	debugger;
        return this.modelFor('marketplace');
    }
});
