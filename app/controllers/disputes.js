Balanced.MarketplaceDisputesController = Balanced.ObjectController.extend(Ember.Evented, Balanced.ResultsTable, {
	needs: ['marketplace'],
	type: 'dispute',
	sortField: 'initiated_at',
	sortOrder: 'desc',

	baseClassSelector: "#dispute",

	results_base_uri: Ember.computed.readOnly('controllers.marketplace.disputes_uri'),
	disputeStatus: 'all',

	extra_filtering_params: function() {
		var disputeStatus = this.get('disputeStatus');

		if (disputeStatus === 'all') {
			return {
				'status[in]': Balanced.SEARCH.DISPUTE_TYPES.join()
			};
		}

		return {
			status: disputeStatus
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
