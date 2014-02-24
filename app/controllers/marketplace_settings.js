Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ["marketplace"],
	keys: [],

	can_edit: Ember.computed.alias('production'),

	userMarketplace: function() {
		var user = Balanced.Auth.get('user');
		var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
		return currentUserMarketplace;
	}.property(),

	init: function() {
		var self = this;
		Balanced.APIKey.findAll()
			.then(function(result) {
				var keys = result.content;
				var date1, date2;
				keys.sort(function(k1, k2) {
					date1 = k1.get('created_at');
					date2 = k2.get('created_at');
					return date1 > date2 ? 1 : -1;
				});
				self.set('keys', keys);
			});
		this._super();
	},

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
