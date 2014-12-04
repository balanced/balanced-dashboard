import ModelRoute from "./model";
import BankAccount from "../models/bank-account";
import TransactionsResultsLoader from "../models/results-loaders/transactions";

var BankAccountsRoute = ModelRoute.extend({
	title: 'Bank Account',
	modelObject: BankAccount,
	marketplaceUri: 'bank_accounts_uri',

	setupController: function(controller, model) {
		var href = model.get("href");
		var store = this.container.lookup("controller:marketplace").get("store");
		this._super(controller, model);

		store.fetchItem("bank_account", href).then(function(model) {
			controller.set("bkModel", model);
		});

		var transactions = TransactionsResultsLoader.create({
			path: model.get("transactions_uri"),
			limit: 10,
		});

		controller.setProperties({
			transactionsResultsLoader: transactions
		});
	},
});

export default BankAccountsRoute;
