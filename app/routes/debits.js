Balanced.DebitsRoute = Balanced.ModelRoute.extend({
	title: 'Debit',
	modelObject: Balanced.Debit,
	marketplaceUri: 'debits_uri',
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.setProperties({
			disputesResultsLoader: model.getDisputesLoader()
		});
	}
});
