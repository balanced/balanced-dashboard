Balanced.MarketplaceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['application'],
	fundingInstrumentSelected: function() {
		var currentRouteName = this.get('controllers.application.currentRouteName');
		return _.contains(Balanced.PAYMENT_METHOD_ROUTES, currentRouteName);
	}.property('controllers.application.currentRouteName'),

	actions: {
		openPaySellerModal: function() {
			this.trigger('openPaySellerModal');
		},

		openChargeCardModal: function() {
			this.trigger('openChargeCardModal');
		}
	},

	formattedEscrowAmount: function() {
		var escrow = this.get('in_escrow');
		if (isNaN(escrow)) {
			return '$--';
		}

		return Balanced.Utils.formatCurrency(escrow);
	}.property('in_escrow'),
});

Balanced.MarketplaceCreditsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceDebitsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceHoldsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceRefundsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});

Balanced.MarketplaceSettingsController = Balanced.ObjectController.extend({
	needs: ['marketplace']
});
