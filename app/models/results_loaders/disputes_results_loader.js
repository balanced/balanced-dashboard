Balanced.DisputesResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Dispute,
	path: Ember.computed.oneWay("marketplace.disputes_uri"),

	sortField: "initiated_at",
	statusFilters: null
});
