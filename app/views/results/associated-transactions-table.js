import TransactionsTableView from "./transactions-table";

var AssociatedTransactionsTableView = TransactionsTableView.extend({
	templateName: "results/associated-transactions-table",
	classNames: ["non-interactive"]
});

export default AssociatedTransactionsTableView;
