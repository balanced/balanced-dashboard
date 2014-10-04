import Ember from "ember";

var MarketplaceSearchController = Ember.ObjectController.extend({
	needs: ['marketplace'],

	// UI properties
	selectedTabType: "transaction",

	isOrdersTabSelected: Ember.computed.equal("selectedTabType", "order"),
	isTransactionsTabSelected: Ember.computed.equal("selectedTabType", "transaction"),
	isCustomersTabSelected: Ember.computed.equal("selectedTabType", "customer"),
	isFundingInstrumentsTabSelected: Ember.computed.equal("selectedTabType", "funding_instrument"),
	isLogsTabSelected: Ember.computed.equal("selectedTabType", "log"),

	totalOrders: Ember.computed.oneWay("resultsLoader.results.total_orders"),
	totalTransactions: Ember.computed.oneWay("resultsLoader.results.total_transactions"),
	totalCustomers: Ember.computed.oneWay("resultsLoader.results.counts.customer"),
	totalFundingInstruments: Ember.computed.oneWay("resultsLoader.results.total_funding_instruments"),
	totalLogs: Ember.computed.oneWay("logsResultsLoader.results.length"),

	isDisplayResults: false,

	isQueryPresent: Ember.computed.gt("resultsLoader.query.length", 0),
	query: Ember.computed.oneWay("resultsLoader.query"),
	isResultsOpen: Ember.computed.and("isQueryPresent", "isDisplayResults"),

	queryChanged: function(a, value) {
		this.set("isDisplayResults", true);
	}.observes("resultsLoader.query"),

	marketplace: Ember.computed.reads("model"),

	resultsLoader: function() {
		var marketplace = this.get("model");
		return marketplace ?
			marketplace.getSearchLoader({}) :
			undefined;
	}.property("marketplace"),

	logsResultsLoader: function() {
		var marketplace = this.get("marketplace");
		return marketplace ? marketplace.getSearchLogsLoader(this.get("query")) : undefined;
	}.property("marketplace", "query"),

	actions: {
		closeSearch: function() {
			this.set("isDisplayResults", false);
		},
		changeTypeFilter: function(type) {
			this.set("selectedTabType", type);
			this.get("resultsLoader").set("searchType", type);
		},
		changeSortOrder: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeDateFilter: function(startTime, endTime) {
			var loader = this.get("resultsLoader");
			if (loader) {
				loader.setProperties({
					endTime: endTime,
					startTime: startTime
				});
			}
		},
		changeTransactionsSort: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
	}
});

export default MarketplaceSearchController;
