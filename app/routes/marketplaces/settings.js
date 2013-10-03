Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Settings',

	model: function(params) {
		var store = this.store;
		return this.modelFor('marketplace').then(function(marketplace) {
			var id = marketplace.get('id');
			return store.find('marketplace_model', id);
		});
	}
});
