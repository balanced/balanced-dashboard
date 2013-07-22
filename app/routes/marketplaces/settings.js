Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
	title: 'Settings',

    model: function (params) {
        return this.modelFor('marketplace');
    }
});
