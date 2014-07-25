var resultsLoaderProperty = function(methodName) {
	return function() {
		return this.get("model")[methodName]();
	}.property("model");
};

Balanced.OrdersController = Balanced.ObjectController.extend({
	needs: ['marketplace'],

	debitsResultsLoader: resultsLoaderProperty("getDebitsResultsLoader"),
	creditsResultsLoader: resultsLoaderProperty("getCreditsResultsLoader"),
	reversalsResultsLoader: resultsLoaderProperty("getReversalsResultsLoader"),
	refundsResultsLoader: resultsLoaderProperty("getRefundsResultsLoader"),

	amounts: function() {
		var amounts = {};
		var types = ['debits', 'refunds', 'credits', 'reversals'];

		_.each(types, function(type) {
			amounts[type] = {
				quantity: 0,
				total: 0
			};

			var things = this.get(type) || Ember.A();
			things.forEach(function(thing) {
				amounts[type].quantity++;
				amounts[type].total += thing.get('amount');
			});

			amounts[type].total = Balanced.Utils.formatCurrency(amounts[type].total);
		}, this);

		return amounts;
	}.property('debits', 'refunds', 'credits', 'reversals',
		'debits.@each.amount', 'refunds.@each.amount',
		'credits.@each.amount', 'reversals.@each.amount'),

	multiple_credits: function() {
		return this.get('credits.length') > 1;
	}.property('credits', 'credits.length')
});
