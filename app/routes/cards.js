import ModelRoute from "./model";
import Card from "../models/card";
import TransactionsResultsLoader from "../models/results-loaders/transactions";

var CardsRoute = ModelRoute.extend({
	title: 'Card',
	modelObject: Card,
	marketplaceUri: 'cards_uri',

	setupController: function(controller, model) {
		this._super(controller, model);

		var transactions = TransactionsResultsLoader.create({
			path: model.get("transactions_uri"),
			limit: 10,
		});

		controller.setProperties({
			transactionsResultsLoader: transactions
		});
	},
});

export default CardsRoute;
