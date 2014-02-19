Balanced.MarketplacesController = Balanced.ArrayController.extend(Ember.Evented, {
	needs: ['marketplace', 'application', 'marketplaces'],
	marketplaceBinding: 'controllers.marketplace',

	user_marketplaces: Ember.computed.alias('Balanced.Auth.user.user_marketplaces'),

	actions: {
		openChangePasswordModal: function() {
			this.trigger('openChangePasswordModal');
		}
	}
});
