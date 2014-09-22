import ResultsTableView from "././results-table";

var LogsResultsView = ResultsTableView.extend({
	classNames: 'logs',
	classNameBindings: 'selected',
	templateName: 'results/logs-table'
});

export default LogsResultsView;
