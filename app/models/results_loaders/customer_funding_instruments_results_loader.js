var FUNDING_INSTRUMENT_TYPES = ["card", "bank_account"];
Balanced.CustomerFundingInstrumentsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.FundingInstrument,
	path: function() {
		return this.get("customer.href") + "/search";
	}.property("customer.href"),

	getTypeFilterValue: function() {
		var type = this.get("type");
		if (!FUNDING_INSTRUMENT_TYPES.contains(type)) {
			type = FUNDING_INSTRUMENT_TYPES;
		}
		return type;
	},

	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();

		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			offset: 0,

			type: this.getTypeFilterValue(),

			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});

		return queryStringBuilder.getQueryStringAttributes();
	}.property("limit", "sort", "type", "startTime", "endTime")
});
