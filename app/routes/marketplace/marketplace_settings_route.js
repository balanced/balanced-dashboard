Balanced.MarketplaceSettingsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Settings',

	setupController: function(controller, marketplace) {
		this._super(controller, marketplace);

		var owner_customer = marketplace.get('owner_customer');
		if (owner_customer) {
			controller.setProperties({
				fundingInstrumentsResultsLoader: owner_customer.getFundingInstrumentsLoader({
					limit: 10
				})
			});
		}
	}
});
