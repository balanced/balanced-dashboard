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
		collection.save(function() {
			var count = collection.filterBy("isSaved").get("length");
			self.transitionToRoute('activity');
			self.refresh("");
			self.send('alert', {
				message: "%@ payouts were successfully submitted".fmt(count),
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
