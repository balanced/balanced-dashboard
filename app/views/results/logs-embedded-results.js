import ResultsTableView from "././results-table";

var LogsEmbeddedResultsView = ResultsTableView.extend({
	classNameBindings: 'selected',
	templateName: 'results/logs-embedded-table'
});

export default LogsEmbeddedResultsView;
