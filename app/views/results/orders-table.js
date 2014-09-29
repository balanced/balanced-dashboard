import ResultsTableView from "./results-table";

var OrdersTableView = ResultsTableView.extend({
	tagName: 'div',
	templateName: "results/orders-table",
	classNames: 'orders',
});

export default OrdersTableView;
