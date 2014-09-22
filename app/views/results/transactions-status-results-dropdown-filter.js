import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var TransactionsStatusResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filters: function() {
		return [
			defineFilter("All", undefined, true),
			defineFilter("Pending", "pending"),
			defineFilter("Succeeded", "succeeded"),
			defineFilter("Failed", "failed")
		];
	}.property(),

	actions: {
		setFilter: function(filterLink) {
			var controller = this.get('controller');
			controller.send('changeStatusFilter', filterLink.value);
			this.toggleSelected(filterLink);
		}
	}
});

export default TransactionsStatusResultsDropdownFilterView;
