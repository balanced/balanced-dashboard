import SearchResultsDropdownFilterView from "./search-results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var SearchPaymentMethodsResultsDropdownFilterView = SearchResultsDropdownFilterView.extend({
	toggleText: "Payment method",
	actionName: "changePaymentMethodFilter",

	filters: function() {
		return [
			defineFilter("All", null, true),
			defineFilter("Card", "card"),
			defineFilter("Bank accounts", "bank_account")
		];
	}.property(),
});

export default SearchPaymentMethodsResultsDropdownFilterView;
