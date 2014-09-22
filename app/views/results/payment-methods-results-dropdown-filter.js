import ResultsDropdownFilterView from "./results-dropdown-filter";
import { defineFilter } from "./results-dropdown-filter";

var PaymentMethodsResultsDropdownFilterView = ResultsDropdownFilterView.extend({
	toggleText: "Payment method",
	filters: function() {
		return [
			defineFilter("All", null, true),
			defineFilter("Card", "card"),
			defineFilter("Bank accounts", "bank_account")
		];
	}.property(),

	actions: {
		setFilter: function(filterLink) {
			var controller = this.get('controller');
			controller.send('changePaymentMethodFilter', filterLink.value);
			this.toggleSelected(filterLink);
		}
	}
});

export default PaymentMethodsResultsDropdownFilterView;
