Balanced.MarketplaceUploadPaymentsCsvRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Upload Csv',
	activate: function() {
		var controller = this.get("controller");
		if (controller) {
			controller.reset();
		}
	},
	deactivate: function() {}
});
