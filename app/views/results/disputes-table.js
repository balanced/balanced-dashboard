import ResultsTableView from "./results-table";

var DisputesTableView = ResultsTableView.extend({
	classNames: 'disputes',
	templateName: 'results/disputes-table',
	colspan: 6
});

export default DisputesTableView;
