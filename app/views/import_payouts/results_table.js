Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "import_payouts/results_table",

	isExisting: Ember.computed.readOnly("creditCreators.isExistingCustomers"),

	isError: false,

	errorReportUri: function() {
		var csv = this.get("creditCreators").toCsvString();
		return Balanced.Utils.toDataUri(csv);
	}.property("creditCreators.length")
});

Balanced.MarketplaceValidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: function() {
		var length = this.get("items.length");
		var str = length === 1 ?
			"%@ valid payout to new customers" :
			"%@ valid payouts to new customers";
		return str.fmt(length);
	}.property("items", "items.length"),
	items: Ember.computed.alias("creditCreators.valid")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: function() {
		var length = this.get("items.length");
		var str = length === 1 ?
			"%@ invalid payout to new customers" :
			"%@ invalid payouts to new customers";
		return str.fmt(length);
	}.property("items", "items.length"),

	isError: true,

	items: Ember.computed.alias("creditCreators.invalid")
});
