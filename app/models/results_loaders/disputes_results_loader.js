Balanced.DisputesResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Dispute,
	path: Ember.computed.oneWay("marketplace.disputes_uri"),
	sort: "initiated_at,desc",
	typeFilters: ["debit"],
	statusFilters: ["pending", "won", "lost", "arbitration"]
});
