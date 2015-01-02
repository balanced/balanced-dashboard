var MarketplaceSearchController = Ember.ObjectController.extend({
	needs: ["marketplace"],
	query: null,

	getModal: function() {
		var c = this.container.lookup("controller:modals-container");
		return c.get("modalsContainer").objectAt(0)
	},

	actions: {
		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.getModal().set("resultsLoader.type", type);
		},

		changePaymentMethodFilter: function(type) {
			this.getModal().set('resultsLoader.type', type);
		},

		changeSortOrder: function(column) {
			this.getModal().get("resultsLoader").setSortField(column);
		},

		changeDateFilter: function(startTime, endTime) {
			this.getModal().setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},

		changeStatusFilter: function(status) {
			this.getModal().set("resultsLoader.statusFilters", status);
		}
	}
});

export default MarketplaceSearchController;
