Balanced.ResultsDropdownFilterView = Balanced.View.extend({
	templateName: "results/results_dropdown_filter",
	classNameBindings: [":dropdown", ":filter"],

	actions: {
		setFilter: function(value) {
			var model = this.get("model");
			console.log
			model.set(this.get("filter"), value);
		}
	}
});

Balanced.TransactionTypesResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Type",
	filter: "typeFilters",
	filters: function() {
		var filters = [];
		var addFilter = function(text, value) {
			filters.push({
				value: value.split(","),
				text: text
			});
		};

		addFilter("All", "debit,credit,hold,refund");
		addFilter("Holds", "hold");
		addFilter("Debits", "debit");
		addFilter("Credits", "credit");
		addFilter("Refunds", "refund");
		addFilter("Reversals", "reversal");

		return filters;
	}.property(),
});

Balanced.FundingInstrumentTypesResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Payment method",
	filter: "typeFilters",
	filters: function() {
		var filters = [];
		var addFilter = function(text, value) {
			filters.push({
				value: value.split(","),
				text: text
			});
		};

		addFilter("All", "card,bank_account");
		addFilter("Cards", "card");
		addFilter("Bank accounts", "bank_account");

		return filters;
	}.property(),
});

Balanced.TransactionStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusFilters",
	filters: function() {
		var filters = [];
		var addFilter = function(text, value) {
			filters.push({
				value: value.split(","),
				text: text
			});
		};

		addFilter("All", "pending,succeeded,failed");
		addFilter("Pending", "pending");
		addFilter("Succeeded", "succeeded");
		addFilter("Failed", "failed");

		return filters;
	}.property(),
});

Balanced.LogsEndpointResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Endpoint",
	filter: "endpointFilters",
	filters: function() {
		var filters = [];
		var addFilter = function(text, value) {
			filters.push({
				value: value.split(","),
				text: text
			});
		};

		filters.push({
			value: undefined,
			text: "All"
		});
		addFilter("Debits", "debits");
		addFilter("Credits", "credits");
		addFilter("Refunds", "refunds");
		addFilter("Holds", "holds");
		addFilter("Customers", "customers");
		addFilter("Accounts", "accounts");
		addFilter("Bank accounts", "bank_accounts");
		addFilter("Cards", "Cards");
		addFilter("Verifications", "verifications");

		return filters;
	}.property(),
});

Balanced.LogsStatusResultsDropdownFilterView = Balanced.ResultsDropdownFilterView.extend({
	toggleText: "Status",
	filter: "statusRollupFilters",
	filters: function() {
		var filters = [];
		var addFilter = function(text, value) {
			filters.push({
				value: value.split(","),
				text: text
			});
		};

		filters.push({
			value: undefined,
			text: "All"
		});
		addFilter("Succeeded", "2xx");
		addFilter("Failed", "3xx,4xx,5xx");

		return filters;
	}.property(),
});
