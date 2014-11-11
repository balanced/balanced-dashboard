import ModalBaseView from "./modal-base";
import Search from "./mixins/search-modal-mixin";

var SearchModalView = ModalBaseView.extend(Search, {
	templateName: 'modals/search-modal',
	elementId: 'search-modal',

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

	isLoaded: Ember.computed.oneWay("resultsLoader.results.isLoaded"),
	isQueryPresent: Ember.computed.gt("resultsLoader.query.length", 0),
	hasResults: Ember.computed.gt("resultsLoader.results.length", 0),
	query: Ember.computed.oneWay("resultsLoader.query"),

	queryDidChange: function(a, value) {
		this.set("isDisplayResults", true);
		this.get("model").set("query", this.get("query"));
	}.observes("query"),

	marketplace: Ember.computed.reads("model"),

	resultsLoader: function() {
		var marketplace = this.get("marketplace");
		return marketplace ?
			marketplace.getSearchLoader({}) :
			undefined;
	}.property("marketplace"),

	logsResultsLoader: function() {
		var marketplace = this.get("marketplace");
		return marketplace ? marketplace.getSearchLogsLoader(this.get("query")) : undefined;
	}.property("marketplace", "query"),

	didInsertElement: function(){
		var self = this;

		$("#q").focus();

		Ember.$('body').on('keyup', function(e) {
			if (e.keyCode === 27) {
				self.close();
			}
		});
	},

	actions: {
		changeSearchTab: function(tabName) {
			this.set("selectedTabType", tabName);
			this.get("resultsLoader").set("searchType", tabName);
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
			var loader = this.get("resultsLoader");
			if (loader) {
				loader.setProperties({
					endTime: endTime,
					startTime: startTime
				});
			}
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
