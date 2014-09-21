import Ember from "ember";

var MarketplaceTransactionsController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	noDownloadsUri: true,

	resultsLoader: Ember.computed.oneWay("model"),
	actions: {
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
