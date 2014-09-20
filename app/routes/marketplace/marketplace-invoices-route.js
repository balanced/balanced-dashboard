Balanced.MarketplaceInvoicesRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Account statements',
	model: function() {
		var marketplace = this.modelFor("marketplace");
		return marketplace.getInvoicesLoader();
	},
});
