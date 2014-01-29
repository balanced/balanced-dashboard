Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	processingCompleted: false,
	processingInProgress: false,

	init: function() {
		this._super();
		var reader = Balanced.PaymentsCsvReader.create();
		this.set("reader", reader);
		reader.set("body", "");
	},

	results: Ember.computed.mapBy("creditCreators", "credit"),

	updateCreditCreators: function() {
		var creditCreators = this.get("reader").getCreditCreators();
		this.set("creditCreators", creditCreators);
		this.get("results");
	}.observes("reader.body"),

	actions: {
		submit: function() {
			var self = this;
			self.set("processingInProgress", true);
			var creditCreators = self.get("creditCreators");
			self.get("reader").saveCreditCreators(creditCreators, function() {
				self.set("processingInProgress", false);
				self.set("processingCompleted", true);
			});
		}
	}
});
