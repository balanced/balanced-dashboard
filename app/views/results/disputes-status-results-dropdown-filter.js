import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var DisputesStatusResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filters: function() {
		return [
			defineFilter("All", null, true),
			defineFilter("Needs attention & Under review", ["pending"]),
			defineFilter("Won", ["won"]),
			defineFilter("Lost", ["lost"])
		];
	}.property(),

	actions: {
		setFilter: function(filterLink) {
			var controller = this.get('controller');
			controller.send('changeDisputeStatusFilter', filterLink.value);
			this.toggleSelected(filterLink);
		}
	}
});

export default DisputesStatusResultsDropdownFilterView;
