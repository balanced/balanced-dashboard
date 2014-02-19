Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "marketplace/upload_payments_csv/results_table",

	isError: false,
});

Balanced.MarketplaceValidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Valid Entries",

	items: Ember.computed.alias("creditCreators.valid")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Invalid Entries",

	isError: true,

	items: Ember.computed.alias("creditCreators.invalid")
});
