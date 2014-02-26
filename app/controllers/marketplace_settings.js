Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

	can_edit: Ember.computed.alias('production'),

	keys: [],

	userMarketplace: function() {
		var user = this.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property('id'),

	keyUpdater: function() {
		window.ms = this;
		var self = this;
		var knownKeys = this.get('userMarketplace.keys');
		var secrets = {};
		if (knownKeys) {
			knownKeys.forEach(function(key) {
				secrets[key.uri] = key.secret;
			});
		}
		Balanced.APIKey.findAll()
			.then(function(result) {
				var keys = result.content;
				var date1, date2;
				var secret;
				keys.sort(function(k1, k2) {
					date1 = k1.get('created_at');
					date2 = k2.get('created_at');
					return date1 < date2 ? 1 : -1;
				});
				keys.forEach(function(key) {
					secret = secrets[key.get('uri')];
					if (secret) {
						key.set('secret', secret);
					}
				});
				self.set('keys', keys);
			});
	}.observes('id'),

	actions: {
		promptToDeleteCallback: function(callback) {
			this.trigger('openDeleteCallbackModal', callback);
		},

		promptToDeleteBankAccount: function(bankAccount) {
			this.trigger('openDeleteBankAccountModal', bankAccount);
		},

		promptToDeleteCard: function(card) {
			this.trigger('openDeleteCardModal', card);
		}
	},

	marketplaceSecret: function() {
		if (this.get('userMarketplace')) {
			return this.get('userMarketplace.secret');
		}

		return '';
	}.property('id', 'user.user_marketplaces.@each.id', 'userMarketplace.secret')
});
