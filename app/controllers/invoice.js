Balanced.InvoiceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],

	actions: {
		printSummary: function() {
			window.print();
		},
		changeTypeFilter: function(type) {
			this.set("transactionsResultsLoader.type", type);
		},
		changeStatusFilter: function(status) {
			if (status === "all") {
				status = null;
			}
			this.set("transactionsResultsLoader.status", status);
		},
		changeDisputeStatusFilter: function(status) {
			this.set('disputesResultsLoader.statusFilters', status);
		}
	},
});
