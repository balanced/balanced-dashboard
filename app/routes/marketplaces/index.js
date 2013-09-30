Balanced.MarketplaceIndexRoute = Balanced.AuthRoute.extend({
	title: 'Marketplaces',

	redirect: function() {
		this.transitionTo('activity', this.modelFor('marketplace'));
	}
});
