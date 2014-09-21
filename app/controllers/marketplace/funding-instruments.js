import Ember from "ember";

var MarketplaceFundingInstrumentsController = Ember.ObjectController.extend(Ember.Evented, {
	needs: ['marketplace'],
	resultsLoader: Ember.computed.oneWay("model"),
	sortField: Ember.computed.oneWay("resultsLoader.sortField"),
	sortOrder: Ember.computed.oneWay("resultsLoader.sortDirection"),

	actions: {
		changePaymentMethodFilter: function(type) {
			this.set('model.type', type);
		},
		changeDateFilter: function(startTime, endTime) {
			this.get("model").setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
		changeSortOrder: function(field, direction) {
			this.get("resultsLoader").setProperties({
				sortField: field,
				sortDirection: direction
			});
		},
		loadMore: function() {
			this.get("resultsLoader.results").loadNextPage();
		},
	}
});

export default MarketplaceFundingInstrumentsController;
