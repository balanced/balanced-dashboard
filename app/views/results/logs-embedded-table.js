import ResultsTableView from "././results-table";

var LogsEmbeddedTableView = ResultsTableView.extend({
	classNameBindings: 'selected',
	templateName: 'results/logs-embedded-table'
});

export default LogsEmbeddedTableView;
