import ModalBaseView from "./modal-base";
import Search from "./mixins/search-modal-mixin";
import Computed from "balanced-dashboard/utils/computed";
import AnalyticsLogger from "balanced-dashboard/utils/analytics_logger";

var SearchModalView = ModalBaseView.extend(Search, {
	templateName: 'modals/search-modal',
	elementId: 'search-modal',

	selectedTabType: "transaction",

	isOrdersTabSelected: Ember.computed.equal("selectedTabType", "order"),
	isTransactionsTabSelected: Ember.computed.equal("selectedTabType", "transaction"),
	isCustomersTabSelected: Ember.computed.equal("selectedTabType", "customer"),
	isFundingInstrumentsTabSelected: Ember.computed.equal("selectedTabType", "funding_instrument"),
	isLogsTabSelected: Ember.computed.equal("selectedTabType", "log"),

	totalResults: Computed.sumAll("resultsLoader.results.total_results", "totalLogs"),
	totalOrders: Ember.computed.oneWay("resultsLoader.results.total_orders"),
	totalTransactions: Ember.computed.oneWay("resultsLoader.results.total_transactions"),
	totalCustomers: Ember.computed.oneWay("resultsLoader.results.counts.customer"),
	totalFundingInstruments: Ember.computed.oneWay("resultsLoader.results.total_funding_instruments"),
	totalLogs: Ember.computed.oneWay("logsResultsLoader.results.length"),

	isDisplayResults: false,

	isLoaded: Ember.computed.oneWay("resultsLoader.results.isLoaded"),
	isQueryPresent: Ember.computed.notEmpty("resultsLoader.query"),
	hasResults: Ember.computed.reads("totalResults"),
	hasLogResult: Ember.computed.notEmpty("logsResultsLoader.results"),
	query: Ember.computed.alias("searchController.query"),

	searchController: function() {
		return this.container.lookup("controller:marketplace/search");
	}.property(),

	queryDidChange: function(a, value) {
		this.set("isDisplayResults", true);
		AnalyticsLogger.trackEvent("Searched for #{this.get('query')}");
	},

	marketplace: Ember.computed.reads("model"),

	resultsLoader: function() {
		var marketplace = this.get("marketplace");
		return marketplace ?
			marketplace.getSearchLoader({
				searchType: this.get("selectedTabType"),
				endTime: this.get("endTime"),
				startTime: this.get("startTime"),
				query: this.get("query")
			}) :
			undefined;
	}.property("marketplace", "query", "selectedTabType", "startTime", "endTime"),

	logsResultsLoader: function() {
		var marketplace = this.get("marketplace");
		return marketplace ? marketplace.getSearchLogsLoader({
			query: this.get("query")
		}) : undefined;
	}.property("marketplace", "query"),

	didInsertElement: function(){
		this.$().hide().fadeIn(300);
		$("#q").focus();

		var self = this;
		Ember.$('body').on('keyup', function(e) {
			if (e.keyCode === 27) { // esc
				self.close();
			}
		});
	},

	actions: {
		changeSearchTab: function(tabName) {
			this.set("selectedTabType", tabName);
		},
		changeTypeFilter: function(type) {
			if (type === "transaction") {
				type = null;
			}

			this.set("resultsLoader.type", type);
		},
		changeSortOrder: function(column) {
			this.get("resultsLoader").setSortField(column);
		},
		changeDateFilter: function(startTime, endTime) {
			this.setProperties({
				endTime: endTime,
				startTime: startTime
			});
		},
		changeStatusFilter: function(status) {
			this.get("resultsLoader").set("statusFilters", status);
		},
		changePaymentMethodFilter: function(type) {
			this.set('resultsLoader.type', type);
		},
	}
});

SearchModalView.reopenClass({
	open: function(model) {
		return this.create({
			model: model
		});
	},
});

export default SearchModalView;
