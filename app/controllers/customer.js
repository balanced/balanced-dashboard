import Ember from "ember";

var CustomerController = Ember.ObjectController.extend({
	needs: ['marketplace'],

	actions: {
		changeDateFilter: function(startTime, endTime) {
			this.get("transactionsResultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},

		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
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
		},
		changeDisputesSort: function(column) {
			this.get("disputesResultsLoader").setSortField(column);
		},

		changePaymentMethodFilter: function(method) {
			this.set("fundingInstrumentsResultsLoader.type", method);
		},

		toggleDrawer: function(className) {
			$('.' + className).slideToggle(200);
		}
	}
});

export default CustomerController;
