require("app/model/transaction");
var TYPES = ["credit", "debit"];

Balanced.InvoiceTransactionsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Transaction,
	type: "hold",

	path: function() {
		var uriProperty = this.get("type") + 's_uri';
		return this.get("invoice").get(uriProperty);
	}.property("invoice", "type"),

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			status: this.get("status"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime")
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("status", "limit", "sort"),
});
