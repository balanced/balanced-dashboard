import ResultsTableView from "./results-table";

var TransactionsTableView = ResultsTableView.extend({
	templateName: "results/transactions-table",
	classNames: 'transactions',
	colspan: 7
});

export default TransactionsTableView;
