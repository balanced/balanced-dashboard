import TransactionsTableView from "./transactions-table";

var OrderCreditsTableView = TransactionsTableView.extend({
	templateName: 'results/order-credits-table',
	classNames: 'non-interactive',
});

export default OrderCreditsTableView;
