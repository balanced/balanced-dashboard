Balanced.OrdersResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Order,
	path: "/search",

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: "order",
			offset: 0,

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("sort", "startTime", "endTime", "limit")
});
