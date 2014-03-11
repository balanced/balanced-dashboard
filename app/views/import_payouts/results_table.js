Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "import_payouts/results_table",

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
			"Valid Entry: %@" :
			"Valid Entries: %@";
		return str.fmt(length);
	}.property("items", "items.length"),
	items: Ember.computed.alias("creditCreators.valid")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: function() {
		var length = this.get("items.length");
		var str = length === 1 ?
			"Invalid Entry: %@" :
			"Invalid Entries: %@";
		return str.fmt(length);
	}.property("items.length"),

	isError: true,

	items: Ember.computed.alias("creditCreators.invalid")
});
