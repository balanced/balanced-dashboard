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
			this.toggleSelected(filterLink);
			// this.get("parentView.resultsLoader").send(this.get("actionName"), filterLink.value);
			this.get("parentView").send(this.get("actionName"), filterLink.value);
		}
	}
});

export default SearchResultsDropdownFilterView;
