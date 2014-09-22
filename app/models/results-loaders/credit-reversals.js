import BaseResultsLoader from "./base";
import ResultsLoaderQueryStringBuilder from "./results-loader-query-string-builder";
import Reversal from "../reversal";

var CreditReversalsResultsLoader = BaseResultsLoader.extend({
	resultsType: Reversal,
	path: Ember.computed.oneWay("credit.reversals_uri"),
	statusFilters: ["failed", "succeeded", "pending"],
	queryStringArguments: function() {
		var queryStringBuilder = new ResultsLoaderQueryStringBuilder();
		queryStringBuilder.addValue("status", this.get("statusFilters"));
		return queryStringBuilder.getQueryStringAttributes();
	}.property("statusFilters")
});

export default CreditReversalsResultsLoader;
