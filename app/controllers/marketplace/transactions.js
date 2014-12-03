import Ember from "ember";

var MarketplaceTransactionsController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	noDownloadsUri: true,

	marketplace: Ember.computed.reads("controllers.marketplace.model"),

	resultsLoader: Ember.computed.oneWay("model"),
	hasUnlinkedTransactions: function() {
		// Note: hiding the notification bar until we get the stats from the API.
		return false;
	}.property(),

	actions: {
		changeSortOrder: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}
			this.set("resultsLoader.type", type);
		},
		changeTransactionsSort: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeStatusFilter: function(status) {
			this.get("resultsLoader").setStatusFilter(status);
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});

export default MarketplaceTransactionsController;
