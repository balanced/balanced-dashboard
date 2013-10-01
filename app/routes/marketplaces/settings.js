Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Settings',

	model: function(params) {
		return this.modelFor('marketplace');
	}
});
