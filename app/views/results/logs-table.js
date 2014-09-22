import ResultsTableView from "./results-table";

var LogsTableView = ResultsTableView.extend({
	classNames: 'logs',
	classNameBindings: 'selected',
	templateName: 'results/logs-table'
});

export default LogsTableView;
