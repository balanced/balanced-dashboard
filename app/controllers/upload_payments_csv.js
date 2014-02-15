Balanced.MarketplaceUploadPaymentsCsvController = Ember.Controller.extend({

	needs: ["marketplace"],

	init: function() {
		this._super();

		this.refresh("");
	},

	refresh: function(text) {
		var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
		this.set("creditCreators", collection);
	},

	save: function(callback) {
		var self = this;
		var collection = self.get("creditCreators");
		collection.save(function () {
			callback();
			var count = collection.filter(function (creator) {
				return creator.get("isComplete");
			}).length;
			self.transitionToRoute('activity');
			self.refresh("");
			self.send('alert', {
				message: "" + count + " payouts were successfully submitted",
				persists: false,
				type: "success"
			});
		});
	},

	actions: {
		removeCreditCreator: function(creator) {
			this.get("creditCreators").removeObject(creator);
		}
	}
});
