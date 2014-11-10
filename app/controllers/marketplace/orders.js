import Ember from "ember";

var MarketplaceOrdersController = Ember.ObjectController.extend({
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),

	actions: {
		changeOrdersSort: function(field, direction) {
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

export default MarketplaceOrdersController;
