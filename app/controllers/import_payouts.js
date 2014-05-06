Balanced.MarketplaceImportPayoutsController = Balanced.Controller.extend(Ember.Evented, {
	needs: ['marketplace'],

	init: function() {
		this._super();
		this.refresh();
	},

	refresh: function(text) {
		var collection = Balanced.CreditCreatorsCollection.fromCsvText(Balanced.currentMarketplace, text);
		this.set('creditCreators', collection);
		if (!collection.get('isEmpty')) {
			collection.addObserver('isLoaded', function() {});
		}
	},

	save: function(callback) {
		var self = this;
		var collection = self.get('creditCreators');
		collection.save(function() {
			if (callback) {
				callback();
			}
			var count = collection.filterBy('isSaved').get('length');
			self.transitionToRoute('activity');
			self.refresh('');
			self.send('alert', {
				message: '%@ payouts were successfully submitted'.fmt(count),
				persists: false,
				type: 'success'
			});
		});
	},

	actions: {
		clearAll: function(){
			var self = this;

			var collection = this.get("creditCreators");
			collection.get("invalid").forEach(function(creator, index) {
				collection.removeObject(creator);
			});
		},

		removeCreditCreator: function(creator) {
			this.get('creditCreators').removeObject(creator);
		},

		openAddFundsModal: function() {
			this.trigger('openAddFundsModal');
		}
	}
});
