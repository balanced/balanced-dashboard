import ResultsTableView from "./results-table";

var OrdersTableView = ResultsTableView.extend({
	tagName: 'div',
	classNames: 'orders',
	templateName: "results/orders-table"
});

export default OrdersTableView;
