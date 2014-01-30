Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();
		var reader = Balanced.PaymentsCsvReader.create();
		this.set("reader", reader);
	},

	updateCreditCreators: function() {
		var creditCreators = this.get("reader").getCreditCreators();
		this.set("creditCreators", creditCreators);
	}.observes("reader.body"),

	actions: {
		removeRow: function(creditCreator) {
			var items = this.get("creditCreators").filter(function(item) {
				return item !== creditCreator;
			});
			this.set("creditCreators", items);
		},

		submit: function() {
			var self = this;
			var creditCreators = self.get("creditCreators");
			self.get("reader").saveCreditCreators(creditCreators, function() {
				console.log("Finished");
			});
		}
	}
});
