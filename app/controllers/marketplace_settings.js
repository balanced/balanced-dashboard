Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

	can_edit: function() {
		return this.get('production');
	}.property('production'),

	userMarketplace: function() {
		var user = Balanced.Auth.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property(),

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
	}.property('id', 'Balanced.Auth.user.user_marketplaces.@each.id', 'userMarketplace.secret')
});
