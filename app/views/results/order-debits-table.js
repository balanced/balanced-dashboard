import TransactionsTableView from "./transactions-table";

var OrderDebitsTableView = TransactionsTableView.extend({
	templateName: 'results/order-debits-table',
	classNames: 'non-interactive',
});

export default OrderDebitsTableView;
