import TransactionsTableView from "./transactions-table";

var EmbeddedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/embedded-transactions-table",
	classNames: ["non-interactive"],
	filteredResults: function() {
		var results = this.get("loader.results");
		var filteredResults = [];

		results.forEach(function(transaction) {
			if (!_.contains(["Hold", "Refund", "Reversal"], transaction.get("type_name"))) {
				filteredResults.pushObject(transaction);
			}

			// TODO: Figure out a better way to include manually created holds
			if (transaction.get("type_name") === "Hold" && Ember.keys(transaction.meta).length !== 0) {
				filteredResults.pushObject(transaction);
			}
		});

		if (filteredResults.length === 0 && results.total > 0) {
			results.loadNextPage();
		}

		return filteredResults;
	}.property("loader.results.length"),
});

export default EmbeddedTransactionsTableView;
