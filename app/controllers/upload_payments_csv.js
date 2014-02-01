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
		self.get("reader").saveCreditCreators(creditCreators, function () {
			callback();
			var count = self.get("creditCreators").filter(function (creator) {
				return creator.get("isComplete");
			}).length;
			self.transitionToRoute('activity');
			self.set("reader.body", "");
			self.send('alert', {
				message: "" + count + " payouts were successfully submitted",
				persists: false,
				type: "success"
			});
		});
	},

	actions: {
		toggleCreditCreator: function(creator) {
			creator.toggleRemove();
		}
	}
});
