import TransactionsTableView from "./transactions-table";

var EmbeddedTransactionsTableView = TransactionsTableView.extend({
	isSmallTable: true,
	colspan: 5
});

export default EmbeddedTransactionsTableView;
