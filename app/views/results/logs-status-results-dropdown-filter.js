import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var LogsStatusResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusRollupFilters",
	filters: function() {
		return [
			defineFilter("All", undefined, true),
			defineFilter("Succeeded", ["2xx"]),
			defineFilter("Failed", ["3xx", "4xx", "5xx"])
		];
	}.property(),
});

export default LogsStatusResultsDropdownFilterView;
