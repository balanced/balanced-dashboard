Balanced.MarketplaceDisputesController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],

	sortField: 'initiated_at',
	sortOrder: 'desc',

	baseClassSelector: "#dispute",

	results_base_uri: Ember.computed.readOnly('controllers.marketplace.disputes_uri')
});

Balanced.DisputeController = Balanced.ObjectController.extend(
	Ember.Evented, {
		needs: ['marketplace']
	}
);
