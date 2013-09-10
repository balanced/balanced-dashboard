Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function () {
		var marketplaceUri = $.cookie(Balanced.COOKIE.MARKETPLACE_URI);
		if (marketplaceUri) {
			this.transitionTo('activity', Balanced.Marketplace.find(marketplaceUri));
		} else {
			this.transitionTo('marketplaces');
		}
	}
});

Balanced.MarketplacesIndexRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Marketplaces',

	redirect: function() {
		if(Balanced.Auth.get('isGuest')) {
			this.transitionTo('marketplace', Balanced.currentMarketplace);
		}
	},

	setupController: function () {
		this.controllerFor('marketplace').set('content', null);
	}
});
