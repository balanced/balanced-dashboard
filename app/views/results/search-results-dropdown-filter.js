import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var SearchResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	resetFilters: function() {
		var filters = this.get("filters");

		filters.map(function(filter) {
			filter.set("isSelected", filter.get('text') === "All");
		});
		this.set("isSelected", false);
	}.observes("parentView.loader"),

	actions: {
		setFilter: function(filterLink) {
			var controller = this.container.lookup("controller:marketplace/search");
			this.toggleSelected(filterLink);
			controller.send(this.get("actionName"), filterLink.value);
		}
	}
});

export default SearchResultsDropdownFilterView;
