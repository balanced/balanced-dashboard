Balanced.MarketplaceImportPayoutsController = Balanced.Controller.extend(Ember.Evented, {
	needs: ['marketplace'],

	init: function() {
		this._super();
		this.refresh();
	},

	refresh: function(text) {
		this.set("csvText", text);

		var collection = this.get("creditCreators");

		if (collection.get("length") > 0) {
			this.trackCollectionEvent("Csv file uploaded");
		}
	},

	creditCreators: function() {
		var text = this.get("csvText");
		this.set("errorMessage", null);

		try {
			return Balanced.CreditCreatorsCollection.fromCsvText(Balanced.currentMarketplace, text);
		} catch (e) {
			this.set("errorMessage", "There was an error reading your CSV file");

			Balanced.Analytics.trackEvent("Csv file parsing error", {
				text: text.slice(0, 200),
				error: e
			});

			return Balanced.CreditCreatorsCollection.create({
				content: []
			});
		}
	}.property("csvText"),

	save: function(callback) {
		var self = this;
		var collection = self.get('creditCreators');

		this.trackCollectionEvent("Csv import started");
		collection.save(function() {
			self.trackCollectionEvent("Csv import finished")
			if (callback) {
				callback();
			}
			var count = collection.filterBy('isSaved').get('length');
			self.transitionToRoute('activity');

			self.refresh('');
			self.send('alert', {
				message: '%@ payouts were successfully submitted. Payouts might take a couple seconds to appear in the transactions list.'.fmt(count),
				persists: false,
				type: 'success'
			});
		});
	},

	trackCollectionEvent: function(message, extra) {
		var collection = this.get("creditCreators");
		var attributes = {
			isExistingCustomers: collection.get("isExistingCustomers"),
			collectionLength: collection.get("length"),
			validLength: collection.get("valid.length"),
			invalidLength: collection.get("invalid.length"),
		};
		_.extend(attributes, extra);
		Balanced.Analytics.trackEvent(message, attributes);
	},

	actions: {
		clearAll: function() {
			this.trackCollectionEvent("Csv invalid rows cleared");

			var collection = this.get("creditCreators");
			collection.get("invalid").forEach(function(creator, index) {
				collection.removeObject(creator);
			});
		},

		removeCreditCreator: function(creator) {
			this.trackCollectionEvent("Csv invalid rows cleared", {
				row: creator.getErrorObject()
			});

			this.get('creditCreators').removeObject(creator);
		},

		openAddFundsModal: function() {
			this.trackCollectionEvent("Csv add funds modal opened");
			this.trigger('openAddFundsModal');
		}
	}
});
