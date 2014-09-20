import Ember from "ember";
import BaseResultsLoader from "./base";
import Dispute from "balanced-dashboard/models/dispute";

var DisputesResultsLoader = BaseResultsLoader.extend({
	resultsType: Dispute,
	path: Ember.computed.oneWay("marketplace.disputes_uri"),

	sortField: "initiated_at",
	statusFilters: null
});

export default DisputesResultsLoader;
