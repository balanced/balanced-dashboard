import Ember from "ember";

var MarketplaceLogsController = Ember.ObjectController.extend(Ember.Evented, {
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

export default MarketplaceLogsController;
