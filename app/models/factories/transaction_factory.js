var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.TransactionFactory = Ember.Object.extend(Ember.Validations, {
	amount: function() {
		try {
			return "" + Balanced.Utils.dollarsToCents("" + this.get('dollar_amount'));
		} catch (e) {
			return undefined;
		}
	}.property("dollar_amount"),
});
