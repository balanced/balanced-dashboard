import ResultsTableView from "./results-table";

var TransactionsTableView = ResultsTableView.extend({
	templateName: "results/transactions-table",
	classNames: 'transactions',
	colspan: 8
});

export default TransactionsTableView;
