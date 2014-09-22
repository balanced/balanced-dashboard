import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var LogsEndpointResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Endpoint",
	filter: "endpointFilters",
	filters: function() {
		return [
			defineFilter("All", undefined, true),
			defineFilter("Accounts", ["accounts"]),
			defineFilter("Bank accounts", ["bank_accounts"]),
			defineFilter("Cards", ["cards"]),
			defineFilter("Credits", ["credits"]),
			defineFilter("Customers", ["customers"]),
			defineFilter("Debits", ["debits"]),
			defineFilter("Holds", ["holds"]),
			defineFilter("Refunds", ["refunds"]),
			defineFilter("Reversals", ["reversals"]),
			defineFilter("Verifications", ["verifications"])
		];
	}.property(),
});

export default LogsEndpointResultsDropdownFilterView;
