import SearchResultsDropdownFilterView from "./search-results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var TransactionsTypeSearchResultsDropdownFilterView = SearchResultsDropdownFilterView.extend({
	toggleText: "Type",
	actionName: "changeTypeFilter",

	filters: function() {
		return [
			defineFilter("All", "transaction", true),
			defineFilter("Credits", "credit"),
			defineFilter("Debits", "debit"),
			defineFilter("Holds", "card_hold"),
			defineFilter("Refunds", "refund"),
			defineFilter("Reversals", "reversal")
		];
	}.property(),
});

export default TransactionsTypeSearchResultsDropdownFilterView;
