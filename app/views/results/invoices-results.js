import ResultsTableView from "././results-table";

var InvoicesResultsView = ResultsTableView.extend({
	classNames: 'invoices',
	classNameBindings: 'selected',
	templateName: 'results/invoices-table'
});

export default InvoicesResultsView;
