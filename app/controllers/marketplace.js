var Computed = {
	isSelected: function() {
		var routes = _.toArray(arguments);

		return function() {
			return routes.indexOf(this.get('controllers.application.currentRouteName')) >= 0;
		}.property('controllers.application.currentRouteName');
	}
};

Balanced.MarketplaceController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openPaySellerModal', 'openChargeCardModal'), {

		needs: ['application'],

		transactionSelected: Computed.isSelected('activity.transactions', 'credits', 'debits', 'holds', 'refunds', 'reversals'),
		orderSelected: Computed.isSelected('activity.orders', 'orders'),
		customerSelected: Computed.isSelected('marketplace.customers', 'customer'),
		fundingInstrumentSelected: Computed.isSelected('marketplace.funding_instruments', 'bank_accounts', 'cards'),
		disputeSelected: Computed.isSelected('marketplace.disputes', 'dispute'),
		logSelected: Computed.isSelected('marketplace.logs', 'log'),
		invoiceSelected: Computed.isSelected('marketplace.invoices', 'invoice'),

		formattedEscrowAmount: function() {
			var escrow = this.get('in_escrow');
			if (isNaN(escrow)) {
				return '$--';
			}

			return Balanced.Utils.formatCurrency(escrow);
		}.property('in_escrow')
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
