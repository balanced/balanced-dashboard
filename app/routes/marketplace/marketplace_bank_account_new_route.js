Balanced.MarketplaceBankAccountNewRoute = Ember.Route.extend({
	pageTitle: 'Create a bank account',
	model: function() {
		return Balanced.MarketplaceBankAccountFactory.create({
			name: "Cool Guy",
			account_number: "111111111",
			routing_number: "123123123"
		});
	}
});
