import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var TransactionsTypeResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Type",
	filters: function() {
		return [
			defineFilter("All", "transaction", true),
			defineFilter("Credits", "credit"),
			defineFilter("Debits", "debit"),
			defineFilter("Holds", "hold"),
			defineFilter("Refunds", "refund"),
			defineFilter("Reversals", "reversal")
		];
	}.property(),

	actions: {
		setFilter: function(filterLink) {
			var controller = this.get('controller');
			controller.send('changeTypeFilter', filterLink.value);
			this.toggleSelected(filterLink);
		}
	}
});

export default TransactionsTypeResultsDropdownFilterView;
