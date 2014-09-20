Balanced.BankAccountsIndexRoute = Balanced.RedirectRoute('activity.funding_instruments');

Balanced.BankAccountsRoute = Balanced.ModelRoute.extend({
	title: 'Bank Account',
	modelObject: Balanced.BankAccount,
	marketplaceUri: 'bank_accounts_uri',

	setupController: function(controller, model) {
		this._super(controller, model);

		var transactions = Balanced.TransactionsResultsLoader.create({
			path: model.get("transactions_uri"),
			limit: 10,
		});

		controller.setProperties({
			transactionsResultsLoader: transactions
		});
	},
});
