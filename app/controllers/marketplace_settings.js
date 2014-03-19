Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],

	can_edit: Ember.computed.alias('production'),

	userMarketplace: function() {
		var user = this.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property('id'),

	marketplaceSecret: function() {
		if (this.get('userMarketplace')) {
			return this.get('userMarketplace.secret');
		}

		return '';
	}.property('userMarketplace', 'userMarketplace.secret'),

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
	}
});
