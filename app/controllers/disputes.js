Balanced.MarketplaceDisputesController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],
	limit: 50,
	type: 'dispute',
	sortField: 'initiated_at',
	sortOrder: 'desc',

	baseClassSelector: "#dispute",

	results_base_uri: Ember.computed.readOnly('controllers.marketplace.disputes_uri'),
	disputeStatus: Balanced.SEARCH.DISPUTE_TYPES,

	extra_filtering_params: function() {
		var disputeStatus = this.get('disputeStatus');

		if (disputeStatus.length > 1) {
			return {
				'status[in]': disputeStatus.join(',')
			};
		}

		return {
			status: disputeStatus[0]
		};
	}.property('disputeStatus'),

	actions: {
		changeDisputeStatusFilter: function(status) {
			this.set('disputeStatus', status);
		}
	}
});

Balanced.DisputeController = Balanced.ObjectController.extend(
	Ember.Evented, {
		needs: ['marketplace']
	}
);
