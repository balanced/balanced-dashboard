Balanced.CustomerCardsResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.BankAccount,
	path: Ember.computed.oneWay("customer.cards_uri")
});
