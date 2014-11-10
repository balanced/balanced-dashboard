import SearchResultsDropdownFilterView from "./search-results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var TransactionsTypeSearchResultsDropdownFilterView = SearchResultsDropdownFilterView.extend({
	toggleText: "Status",
	actionName: "changeStatusFilter",

	filters: function() {
		return [
			defineFilter("All", undefined, true),
			defineFilter("Pending", "pending"),
			defineFilter("Succeeded", "succeeded"),
			defineFilter("Failed", "failed")
		];
	}.property(),
});

export default TransactionsTypeSearchResultsDropdownFilterView;
