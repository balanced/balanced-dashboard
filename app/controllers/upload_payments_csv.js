Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	processingCompleted: false,
	processingInProgress: false,

	init: function() {
		this._super();
		var reader = Balanced.PaymentsCsvReader.create();
		this.set("reader", reader);
	},

	results: Ember.computed.mapBy("creditCreators", "credit"),

	creditCreators: function() {
		this.set("processingCompleted", false);
		this.set("processingInProgress", false);
		return this.get("reader").getCreditCreators();
	}.property("reader.body"),

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
