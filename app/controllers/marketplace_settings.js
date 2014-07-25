Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDeleteCardModal', 'openDeleteBankAccountModal', 'openDeleteCallbackModal'), {
		needs: ["marketplace"],

		can_edit: Ember.computed.alias('production'),

		userMarketplace: function() {
			var user = this.get('user');
			var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
			return currentUserMarketplace;
		}.property('id'),

		marketplaceSecret: function() {
			return this.get('userMarketplace.secret') || '';
		}.property('userMarketplace', 'userMarketplace.secret'),

		actions: {
			openDeleteModal: function(funding_instrument) {
				if (funding_instrument.get('type_name').indexOf('card') >= 0) {
					this.trigger('openDeleteCardModal', funding_instrument);
				} else if (funding_instrument.get('type_name').indexOf('account') >= 0) {
					this.trigger('openDeleteBankAccountModal', funding_instrument);
				}
			}
		}
	});
