Balanced.InvoiceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],

	actions: {
		printSummary: function() {
			window.print();
		},
		changeTypeFilter: function(type) {
			this.set("transactionsResultsLoader.type", type);
		},

		changeTransactionsSort: function(column) {
			this.get("transactionsResultsLoader").setSortField(column);
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
