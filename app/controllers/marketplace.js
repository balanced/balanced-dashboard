Balanced.MarketplaceController = Balanced.ObjectController.extend(Ember.Evented, {
	needs: ['application'],
	classNameBindings: ['active'],
	active: function() {
		var currentRouteName = this.get('controllers.application.currentRouteName');
		console.log(currentRouteName);
		if (currentRouteName == 'credits') {
			return "active";
		}
	}.property('controllers.application.currentRouteName'),

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
