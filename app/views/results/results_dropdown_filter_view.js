Balanced.ResultsDropdownFilterView = Balanced.View.extend({
	templateName: "results/results_dropdown_filter",
	classNameBindings: [":dropdown", ":filter"],
	isSelected: false,

	actions: {
		setFilter: function(value) {
			var model = this.get("model");
			model.set(this.get("filter"), value);

			var filters = this.get("filters");
			filters.map(function(filter) {
				filter.set("isSelected", false);
			});

			var filter = filters.findBy("value", value);
			filter.set("isSelected", true);

			if (filter.get('text') === "All") {
				this.set("isSelected", false);
			} else {
				this.set("isSelected", true);
			}
		}
	}
});

var defineFilter = function(text, value, isSelected) {
	return Ember.Object.create({
		value: value,
		text: text,
		isSelected: isSelected
	});
};

Balanced.TransactionsTypeResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Type",
	filter: "typeFilters",
	filters: function() {
		return [
			defineFilter("All", ["transaction"], true),
			defineFilter("Credits", ["credit"]),
			defineFilter("Debits", ["debit"]),
			defineFilter("Holds", ["card_hold"]),
			defineFilter("Refunds", ["refund"]),
			defineFilter("Reversals", ["reversal"])
		];
	}.property(),
});

Balanced.TransactionsStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusFilters",
	filters: function() {
		return [
			defineFilter("All", ["all"], true),
			defineFilter("Pending", ["pending"]),
			defineFilter("Succeeded", ["succeeded"]),
			defineFilter("Failed", ["failed"])
		];
	}.property(),
});

Balanced.PaymentMethodsResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Payment method",
	filter: "typeFilters",
	filters: function() {
		return [
			defineFilter("All", ["funding_instrument"], true),
			defineFilter("Card", ["card"]),
			defineFilter("Bank accounts", ["bank_account"])
		];
	}.property(),
});

Balanced.DisputesStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusFilters",
	filters: function() {
		return [
			defineFilter("All", ["all"], true),
			defineFilter("Pending", ["pending"]),
			defineFilter("Won", ["won"]),
			defineFilter("Lost", ["lost"]),
			defineFilter("Arbitration", ["arbitration"])
		];
	}.property(),
});

Balanced.LogsEndpointResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
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

Balanced.LogsStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusRollupFilters",
	filters: function() {
		return [
			defineFilter("All", undefined, true),
			defineFilter("Succeeded", ["2xx"]),
			defineFilter("Failed", ["3xx", "4xx", "5xx"])
		];
	}.property(),
});
