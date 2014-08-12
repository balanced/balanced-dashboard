Balanced.DisputeRoute = Balanced.ModelRoute.extend({
	title: 'Dispute',
	modelObject: Balanced.Dispute,
	marketplaceUri: 'disputes_uri',
	setupController: function(controller, dispute) {
		this._super(controller, dispute);

		controller.setProperties({
			transactionsResultsLoader: dispute.getTransactionsLoader()
		});
	}
});
