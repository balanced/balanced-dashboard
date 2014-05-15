Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "import_payouts/results_table",

	isExisting: Ember.computed.readOnly("creditCreators.isExistingCustomers"),

	isError: false,

	title: function() {
		var length = this.get("items.length");
		var validityAdjective = this.get("validityAdjective")
		var customersType = this.get("isExisting") ?
			"existing" :
			"new";

		var pattern = length === 1 ?
			"%@ %@ payout to %@ customers" :
			"%@ %@ payouts to %@ customers";
		return pattern.fmt(length, validityAdjective, customersType);
	}.property("items", "items.length", "isExisting", "validityAdjective"),

	errorReportUri: function() {
		var csv = this.get("creditCreators").toCsvString();
		return Balanced.Utils.toDataUri(csv);
	}.property("creditCreators.length")
});

Balanced.MarketplaceValidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	validityAdjective: "valid",
	items: Ember.computed.alias("creditCreators.valid")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	validityAdjective: "invalid",
	isError: true,
	items: Ember.computed.alias("creditCreators.invalid")
});
