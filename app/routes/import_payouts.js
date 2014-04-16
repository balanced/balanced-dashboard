Balanced.MarketplaceImportPayoutsRoute = Balanced.AuthRoute.extend({
	pageTitle: 'Import Payouts',

	setupController: function(controller, model) {
		controller.refresh();
		this._super(controller, model);
	},

	renderTemplate: function() {
		this.render('import_payouts/index');
	}
});
