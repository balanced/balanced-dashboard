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
		var self = this;
		var knownKeys = this.get('userMarketplace.keys');
		var secrets = {};
		var keyID;
		if (knownKeys) {
			knownKeys.forEach(function(key) {
				if (key.uri) {
					keyID = key.uri.replace(/.*\//, '');
					secrets[keyID] = key.secret;
				}
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
					secret = secrets[key.get('id')];
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
