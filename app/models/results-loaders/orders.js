import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import Order from "balanced-dashboard/models/order";

var OrdersResultsLoader = BaseResultsLoader.extend({
	resultsType: Order,
	limit: 20,
	queryStringArguments: function() {
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "limit")
});

export default OrdersResultsLoader;
