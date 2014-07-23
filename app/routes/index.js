Balanced.IndexRoute = Balanced.AuthRoute.extend({
	redirect: function() {
		var self = this;
		var marketplaceUri = this.get('auth').getLastUsedMarketplaceUri();
		if (marketplaceUri) {
			Balanced.Marketplace.find(marketplaceUri)
				.then(function(marketplace) {
					self.transitionTo('transaction', marketplace);
				});
		} else {
			this.transitionTo('marketplaces');
		}
	}
});
