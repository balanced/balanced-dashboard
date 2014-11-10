import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import Transaction from "../transaction";
import FundingInstrument from "../funding-instrument";
import Customer from "../customer";
import Order from "../order";
import SearchModelArray from "../core/search-model-array";

var TRANSACTION_TYPES = ["credit", "debit", "card_hold", "refund", "reversal"];
var FUNDING_INSTRUMENT_TYPES = ["card", "bank_account"];
var CUSTOMER_TYPES = ["customer"];
var ORDER_TYPES = ["order"];

var MarketplaceSearchResultsLoader = BaseResultsLoader.extend({
	searchType: "transaction",
	limit: null,

	type: function() {
		var mapping = {
			"funding_instrument": FUNDING_INSTRUMENT_TYPES,
			"customer": CUSTOMER_TYPES,
			"order": ORDER_TYPES
		};

		return mapping[this.get("searchType")] || TRANSACTION_TYPES;
	}.property("searchType"),

	resultsType: function() {
		var mapping = {
			"funding_instrument": FundingInstrument,
			"customer": Customer,
			"order": Order
		};
		return mapping[this.get("searchType")] || Transaction;
	}.property("searchType"),

	results: function() {
		if (Ember.isBlank(this.get("query"))) {
			return SearchModelArray.create({
				isLoaded: true
			});
		} else {
			var uri = this.get('resultsUri');
			var type = this.get('resultsType');
			return SearchModelArray.newArrayLoadedFromUri(uri, type);
		}
	}.property("query", "resultsUri", "resultsType"),

	queryStringArguments: function() {
		var q = this.get("query");
		if (q === "%") {
			q = "";
		}
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: this.get("type"),
			status: this.get("statusFilters"),
			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
			q: q
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("type", "limit", "sort", "startTime", "endTime", "query", "statusFilters"),

	path: function() {
		return this.get("marketplace.uri") + "/search";
	}.property("marketplace.uri"),

	getCsvExportType: function() {
		return undefined;
	},
});

export default MarketplaceSearchResultsLoader;
