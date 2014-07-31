Balanced.CardsIndexRoute = Balanced.RedirectRoute('activity.funding_instruments');

Balanced.CardsRoute = Balanced.ModelRoute.extend({
	title: 'Card',
	modelObject: Balanced.Card,
	marketplaceUri: 'cards_uri',

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
