import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import Transaction from "balanced-dashboard/models/transaction";

var InvoiceTransactionsResultsLoader = BaseResultsLoader.extend({
	resultsType: Transaction,
	type: "bank_account_credits",

	path: function() {
		var uriBase = this.get("invoice.uri");
		var type = this.get("type");
		return uriBase + "/" + type;
	}.property("invoice.uri", "type"),

	queryStringArguments: function() {
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();

		var attributes = this.getProperties("limit", "sort", "status");
		_.extend(attributes, {
			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime")
		});

		queryStringBuilder.addValues(attributes);

		return queryStringBuilder.getQueryStringAttributes();
	}.property("type", "status", "limit", "sort"),
});

export default InvoiceTransactionsResultsLoader;
