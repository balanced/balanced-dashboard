import TransactionsTableView from "./transactions-table";

var EmbeddedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/embedded-transactions-table",
	classNames: ["non-interactive"],
	filteredResults: Ember.computed.filter("loader.results", function(transaction) {
		var IGNOREABLE_TRANSACTIONS = ["Hold", "Refund", "Reversal"];
		var transactionType = transaction.get("type_name");
		return !IGNOREABLE_TRANSACTIONS.contains(transactionType) || (transactionType === "Hold" && transaction.get("debit_uri") === null);
	}),
});

export default EmbeddedTransactionsTableView;
