Balanced.TransactionsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Transaction,
	path: Ember.computed.oneWay("marketplace.transactions_uri"),
	typeFilters: ["transaction", "credit", "debit", "card_hold", "refund", "reversal"],
	statusFilters: ["failed", "succeeded", "pending"],
});
