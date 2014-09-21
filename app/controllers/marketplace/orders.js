import Ember from "ember";

var MarketplaceOrdersController = Ember.ObjectController.extend({
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),

	actions: {
		changeOrdersSort: function(column) {
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

export default MarketplaceOrdersController;
