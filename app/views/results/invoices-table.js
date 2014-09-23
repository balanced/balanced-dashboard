import ResultsTableView from "././results-table";

var InvoicesTableView = ResultsTableView.extend({
	classNames: 'invoices',
	classNameBindings: 'selected',
	templateName: 'results/invoices-table'
});

export default InvoicesTableView;
