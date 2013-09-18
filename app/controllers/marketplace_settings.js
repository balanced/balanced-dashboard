Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

	actions: {
		promptToDeleteCallback: function (callback) {
			this.trigger('openDeleteCallbackModal', callback);
		},

		promptToDeleteBankAccount: function (bankAccount) {
			this.trigger('openDeleteBankAccountModal', bankAccount);
		},

		promptToDeleteCard: function (card) {
			this.trigger('openDeleteCardModal', card);
		},
	},

	fullyLoaded: function () {
		var ownerCustomer = this.get('owner_customer');
		return this.get('isLoaded') &&
			ownerCustomer.get('isLoaded') &&
			ownerCustomer.get('bank_accounts').get('isLoaded') &&
			ownerCustomer.get('cards').get('isLoaded') &&
			this.get('callbacks').get('isLoaded');
	}.property(
		'isLoaded',
		'owner_customer.isLoaded',
		'owner_customer.bank_accounts.isLoaded',
		'owner_customer.cards.isLoaded',
		'callbacks.isLoaded'
	),

	marketplaceSecret: function () {
		var uri = this.get('uri');
		var user = Balanced.Auth.get('user');
		var currentUserMarketplace = user.user_marketplace_for_uri(uri);

		if (currentUserMarketplace) {
			return currentUserMarketplace.get('secret');
		}

		if (Balanced.Auth.getGuestAPIKey()) {
			return Balanced.Auth.getGuestAPIKey();
		}

		return '';
	}.property('uri', 'Balanced.Auth.user.user_marketplaces.@each.uri')
});
