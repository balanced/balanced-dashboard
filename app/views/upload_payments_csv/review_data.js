Balanced.MarketplaceUploadPaymentsCsvReviewDataView = Balanced.WizardStepView.extend({
	init: function() {
		this._super();
		var reader = this.get("controller").get("reader");
	},

	escrow_balance: 190,

	payout_total: function() {
		var reader = this.get("controller").get("reader");
		return reader ?
			reader.totalPayoutBalance() :
			null;
	}.property("controller.reader"),

	customers_total: function() {
		var reader = this.get("controller").get("reader");
		return reader ?
			reader.totalNumberOfCustomers() :
			null;
	}.property("controller.reader"),

	actions: {
		submit: function() {
			this.get("controller").setStartProcessing();
		}
	}
});
