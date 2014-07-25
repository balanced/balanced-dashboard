Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var self = this;
		var marketplaceUri = this.get('auth').getLastUsedMarketplaceUri();
		this.transitionTo('marketplaces');
	}
});
