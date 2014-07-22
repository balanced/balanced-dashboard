Balanced.MarketplaceCustomersController = Balanced.ObjectController.extend({
	needs: ['marketplace'],
	noDownloadsUri: true,
	resultsLoader: Ember.computed.oneWay("model"),
	actions: {
		changeSortOrder: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});
