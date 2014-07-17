Balanced.CustomersResultsLoader = Balanced.ResultsLoader.extend({
	resultsType: Balanced.Customer,
	path: Ember.computed.oneWay("marketplace.customers_uri"),
});
