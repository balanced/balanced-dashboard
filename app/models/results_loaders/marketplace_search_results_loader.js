var TRANSACTION_TYPES = ["credit", "debit", "card_hold", "refund", "reversal"];
var FUNDING_INSTRUMENT_TYPES = ["card", "bank_account"];
var CUSTOMER_TYPES = ["customer"];
var ORDER_TYPES = ["order"];

Balanced.MarketplaceSearchResultsLoader = Balanced.ResultsLoader.extend({
	searchType: "transaction",
	limit: null,

	type: function() {
		var mapping = {
			"funding_instrument": FUNDING_INSTRUMENT_TYPES,
			"customer": CUSTOMER_TYPES,
			"order": ORDER_TYPES,
		};

		return mapping[this.get("searchType")] || TRANSACTION_TYPES;
	}.property("searchType"),

	resultsType: function() {
		var mapping = {
			"funding_instrument": Balanced.FundingInstrument,
			"customer": Balanced.Customer,
			"order": Balanced.Order
		};
		return mapping[this.get("searchType")] || Balanced.Transaction;
	}.property("searchType"),

	results: function() {
		if (Ember.isBlank(this.get("query"))) {
			return Balanced.SearchModelArray.create({
				isLoaded: true
			});
		} else {
			var uri = this.get('resultsUri');
			var type = this.get('resultsType');
			return Balanced.SearchModelArray.newArrayLoadedFromUri(uri, type);
		}
	}.property("query", "resultsUri", "resultsType"),

	queryStringArguments: function() {
		var q = this.get("query");
		if (q === "%") {
			q = "";
		}

		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: this.get("type"),
			method: this.get("methodFilters"),
			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
			q: q
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("type", "limit", "sort", "methodFilters", "startTime", "endTime", "query", "path", "searchType"),

	path: function() {
		return this.get("marketplace.uri") + "/search";
	}.property("marketplace.uri", "query"),

	getCsvExportType: function() {
		return undefined;
	},
});
