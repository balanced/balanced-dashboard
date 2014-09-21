import Ember from "ember";

var MarketplaceDisputesController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),
	actions: {
		changeDisputesSort: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeDisputeStatusFilter: function(status) {
			this.set('resultsLoader.statusFilters', status);
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("resultsLoader").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
	}
});

export default MarketplaceDisputesController;
