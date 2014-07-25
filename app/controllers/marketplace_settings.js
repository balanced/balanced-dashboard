Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openDeleteModal', 'openDeleteCallbackModal'), {
		needs: ["marketplace"],

		can_edit: Ember.computed.alias('production'),

		userMarketplace: function() {
			var user = this.get('user');
			var currentUserMarketplace = user.user_marketplace_for_id(this.get('id'));
			return currentUserMarketplace;
		}.property('id'),

		marketplaceSecret: function() {
			return this.get('userMarketplace.secret') || '';
		}.property('userMarketplace', 'userMarketplace.secret')
	});
