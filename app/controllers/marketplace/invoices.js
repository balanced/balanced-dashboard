import Ember from "ember";

var MarketplaceInvoicesController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace', "notification_center"],

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

export default MarketplaceInvoicesController;
