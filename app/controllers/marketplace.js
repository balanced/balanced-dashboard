Balanced.MarketplaceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['application'],

	actions: {
		openPaySellerModal: function() {
			this.trigger('openPaySellerModal');
		},
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
