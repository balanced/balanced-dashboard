Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

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
	},

	marketplaceSecret: function() {
		var uri = this.get('uri');
		var user = Balanced.Auth.get('user');
		var currentUserMarketplace = user.user_marketplace_for_uri(uri);

		if (currentUserMarketplace) {
			return currentUserMarketplace.get('secret');
		}

		return '';
	}.property('uri', 'Balanced.Auth.user.user_marketplaces.@each.uri')
});
