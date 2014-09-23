import Ember from "ember";

var InvoiceController = Ember.ObjectController.extend(Ember.Evented, {
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
			this.get("transactionsResultsLoader").setStatusFilter(status);
		},
		changeDisputeStatusFilter: function(status) {
			this.set('disputesResultsLoader.statusFilters', status);
		}
	},
});

export default InvoiceController;
