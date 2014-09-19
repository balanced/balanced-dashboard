import Ember from "ember";
import ResultsLoader from "./results-loader";
import Dispute from "balanced-dashboard/models/dispute";

var DisputesResultsLoader = ResultsLoader.extend({
	resultsType: Dispute,
	path: Ember.computed.oneWay("marketplace.disputes_uri"),

	sortField: "initiated_at",
	statusFilters: null
});

export default DisputesResultsLoader;
