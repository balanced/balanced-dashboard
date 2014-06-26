Balanced.ResultsDropdownFilterView = Balanced.View.extend({
	templateName: "results/results_dropdown_filter",
	classNameBindings: [":dropdown", ":filter"],

	actions: {
		setFilter: function(value) {
			var model = this.get("model");
			model.set(this.get("filter"), value);
		}
	}
});

var defineFilter = function(text, value) {
	return {
		value: value,
		text: text
	};
};

Balanced.LogsEndpointResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Endpoint",
	filter: "endpointFilters",
	filters: function() {
		return [
			defineFilter("All", undefined),
			defineFilter("Debits", ["debits"]),
			defineFilter("Credits", ["credits"]),
			defineFilter("Refunds", ["refunds"]),
			defineFilter("Holds", ["holds"]),
			defineFilter("Customers", ["customers"]),
			defineFilter("Accounts", ["accounts"]),
			defineFilter("Bank accounts", ["bank_accounts"]),
			defineFilter("Cards", ["Cards"]),
			defineFilter("Verifications", ["verifications"])
		];
	}.property(),
});

Balanced.LogsStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusRollupFilters",
	filters: function() {
		return [
			defineFilter("All", undefined),
			defineFilter("Succeeded", ["2xx"]),
			defineFilter("Failed", ["3xx", "4xx", "5xx"])
		];
	}.property(),
});
