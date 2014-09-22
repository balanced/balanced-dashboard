import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import Transaction from "balanced-dashboard/models/transaction";

var VALID_STATUSES = ["failed", "succeeded", "pending"];

var TransactionsResultsLoader = BaseResultsLoader.extend({
	resultsType: Transaction,
	typeFilters: undefined,

	setStatusFilter: function(value) {
		if (!VALID_STATUSES.contains(value)) {
			value = VALID_STATUSES;
		}
		this.set("status", value);
	},

	status: VALID_STATUSES,

	queryStringArguments: function() {
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: this.get("type"),
			status: this.get("status"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "type", "status", "limit")
});

export default TransactionsResultsLoader;
