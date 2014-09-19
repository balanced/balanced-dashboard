import ResultsLoader from "./results-loader";

var CreditReversalsResultsLoader = ResultsLoader.extend({
	resultsType: Balanced.Reversal,
	path: Ember.computed.oneWay("credit.reversals_uri"),
	statusFilters: ["failed", "succeeded", "pending"],
	queryStringArguments: function() {
		var queryStringBuilder = new Balanced.ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValue("status", this.get("statusFilters"));
		return queryStringBuilder.getQueryStringAttributes();
	}.property("statusFilters")
});

export default CreditReversalsResultsLoader;
