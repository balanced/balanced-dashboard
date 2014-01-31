Balanced.MarketplaceCsvPaymentsTableView = Balanced.View.extend({
	templateName: "marketplace/upload_payments_csv/results_table",

	isError: false,
	isNeutral: false
});

Balanced.MarketplaceValidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Valid Entries",

	itemsCount: function() {
		return this.get("items").length;
	}.property("items"),

	items: function() {
		return this.get("creditCreators").filter(function(creditCreator) {
			return !creditCreator.get("isInvalid");
		});
	}.property("creditCreators")
});

Balanced.MarketplaceInvalidCsvPaymentsTableView = Balanced.MarketplaceCsvPaymentsTableView.extend({
	title: "Invalid Entries",

	isError: true,
	isNeutral: Ember.computed.equal("itemsCount", 0),

	itemsCount: function() {
		return this.get("items").filter(function(item) {
			return !item.get("isRemoved");
		}).length;
	}.property("items.@each.isRemoved"),

	items: function() {
		return this.get("creditCreators").filter(function(creditCreator) {
			return creditCreator.get("isInvalid");
		});
	}.property("creditCreators")
});
