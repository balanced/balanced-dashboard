import TransactionsTableView from "./transactions-table";

var EmbeddedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/embedded-transactions-table",
	classNames: ["non-interactive"]
});

export default EmbeddedTransactionsTableView;
