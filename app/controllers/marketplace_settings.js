Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

	can_edit: function() {
		return this.get('production');
	}.property('production'),

	actions: {
		promptToDeleteCallback: function(callback) {
			this.trigger('openDeleteCallbackModal', callback);
		},

		promptToDeleteBankAccount: function(bankAccount) {
			this.trigger('openDeleteBankAccountModal', bankAccount);
		},

		promptToDeleteCard: function(card) {
			this.trigger('openDeleteCardModal', card);
		},

		resetAPIKey: function() {
			var user = Balanced.Auth.get('user');
			var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
			var currentSecret = currentUserMarketplace.get('secret');
			var apiKeySecret;
			Balanced.APIKey.create().save().then(function(apiKey) {
				apiKeySecret = apiKey.get('secret');
				currentUserMarketplace.set('secret', apiKeySecret);
				currentUserMarketplace.save();
				Balanced.Auth.unsetAPIKey();
				Balanced.Auth.setAPIKey(apiKeySecret);
			});
		},
	},

	marketplaceSecret: function() {
		var user = Balanced.Auth.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));

		if (currentUserMarketplace) {
			return currentUserMarketplace.get('secret');
		}

		return '';
	}.property('id', 'Balanced.Auth.user.user_marketplaces.@each.id')
});
