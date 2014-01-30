Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "marketplace/upload_payments_csv/results_table",

	isError: false
});

Balanced.MarketplaceValidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Valid Entries",

	items: function () {
		return this.get("creditCreators").filter(function (creditCreator) {
			return !creditCreator.get("isInvalid");
		});
	}.property("creditCreators")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Invalid Entries",

	isError: true,

	items: function () {
		return this.get("creditCreators").filter(function (creditCreator) {
			return creditCreator.get("isInvalid");
		});
	}.property("creditCreators")
});
