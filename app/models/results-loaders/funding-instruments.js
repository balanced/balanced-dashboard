import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import FundingInstrument from "balanced-dashboard/models/funding-instrument";

var FUNDING_INSTRUMENT_TYPES = ["card", "bank_account"];

var FundingInstrumentsResultsLoader = BaseResultsLoader.extend({
	resultsType: FundingInstrument,
	getTypeFilterValue: function() {
		var type = this.get("type");
		if (!FUNDING_INSTRUMENT_TYPES.contains(type)) {
			type = FUNDING_INSTRUMENT_TYPES;
		}
		return type;
	},

	queryStringArguments: function() {
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValues({
			limit: this.get("limit"),
			sort: this.get("sort"),
			type: this.getTypeFilterValue(),
			"created_at[>]": this.get("startTime"),
			"created_at[<]": this.get("endTime"),
		});
		return queryStringBuilder.getQueryStringAttributes();
	}.property("type", "limit", "sort", "startTime", "endTime"),

	path: function() {
		return this.get("marketplace.uri") + "/search";
	}.property("marketplace.uri"),
});

export default FundingInstrumentsResultsLoader;
