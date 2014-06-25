Balanced.MarketplaceLogsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),
	sortField: Ember.computed.oneWay("resultsLoader.sortField"),
	sortOrder: Ember.computed.oneWay("resultsLoader.sortDirection"),
	actions: {
		changeSortOrder: function(field, direction) {
			this.get("resultsLoader").setProperties({
				sortField: field,
				sortDirection: direction
			});
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});

/*
	This controller provides embedded log records in resource pages
*/
Balanced.LogsEmbeddedController = Balanced.MarketplaceLogsController.extend({
	resultsLoader: function() {
		var marketplace = this.modelFor("marketplace");
		return Balanced.LogsResultsLoader.create({
			limit: 5,
			resource: this.get("model"),
			marketplace: marketplace
		});
	}.property(),
});
