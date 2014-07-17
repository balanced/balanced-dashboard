Balanced.FundingInstrumentsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.FundingInstrument,
	queryStringArguments: function() {
		var type = this.get("type");
		if (Ember.isBlank(type)) {
			type = ["bank_account", "card"];
		}

		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			offset: 0,
			type: type,
			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});
		return queryStringBuilder.getQueryStringAttributes();
	}.property("type", "limit", "sort", "startTime", "endTime"),

	path: function() {
		return this.get("marketplace.uri") + "/search";
	}.property("marketplace.uri"),
});
