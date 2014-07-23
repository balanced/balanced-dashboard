Balanced.InvoiceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],

	actions: {
		printSummary: function() {
			window.print();
		},
		changeTypeFilter: function(type) {
			this.set('type', type);
		},
		changeStatusFilter: function(status) {
			this.set('transactionStatus', status);
		},
		changeDisputeStatusFilter: function(status) {
			this.set('disputesResultsLoader.statusFilters', status);
		}
	},
});
