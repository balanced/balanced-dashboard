Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();
		var reader = Balanced.PaymentsCsvReader.create();
		this.set("reader", reader);
		this.set("creditCreators", []);
	},

	updateCreditCreators: function() {
		var creditCreators = this.get("reader").getCreditCreators();
		this.set("creditCreators", creditCreators);
	}.observes("reader.body"),

	save: function(callback) {
		var self = this;
		var creditCreators = self.get("creditCreators");
		self.get("reader").saveCreditCreators(creditCreators, callback);
	},

	actions: {
		toggleCreditCreator: function(cc) {
			cc.toggleRemove();
		}
	}
});
