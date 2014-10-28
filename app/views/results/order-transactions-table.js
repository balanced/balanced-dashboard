import TransactionsTableView from "./transactions-table";

var OrderTransactionsTableView = TransactionsTableView.extend({
	templateName: 'results/order-transactions-table',
	classNames: 'non-interactive',
});

export default OrderTransactionsTableView;
