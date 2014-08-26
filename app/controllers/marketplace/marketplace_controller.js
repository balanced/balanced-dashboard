var Computed = {
	isSelected: function() {
		var routes = _.toArray(arguments);

		return function() {
			return routes.indexOf(this.get('controllers.application.currentRouteName')) >= 0;
		}.property('controllers.application.currentRouteName');
	}
};

Balanced.MarketplaceController = Balanced.ObjectController.extend({

	needs: ['application', 'notification_center', 'sessions'],

	transactionSelected: Computed.isSelected('marketplace.transactions', 'credits', 'debits', 'holds', 'refunds', 'reversals'),
	orderSelected: Computed.isSelected('marketplace.orders', 'orders'),
	customerSelected: Computed.isSelected('marketplace.customers', 'customer'),
	fundingInstrumentSelected: Computed.isSelected('marketplace.funding_instruments', 'bank_accounts', 'cards'),
	disputeSelected: Computed.isSelected('marketplace.disputes', 'dispute'),
	logSelected: Computed.isSelected('marketplace.logs', 'log'),
	invoiceSelected: Computed.isSelected('marketplace.invoices', 'invoice'),
	settingSelected: Computed.isSelected('marketplace.settings'),

	// Note: need this since bind-attr only works for a single property
	paymentSelected: Ember.computed.or('transactionSelected', 'orderSelected'),
	myMarketplaceSelected: Ember.computed.or('settingSelected', 'invoiceSelected'),

	formattedEscrowAmount: function() {
		var escrow = this.get('in_escrow');
		if (isNaN(escrow)) {
			return '$--';
		}

		return Balanced.Utils.formatCurrency(escrow);
	}.property('in_escrow'),

	getNotificationController: function() {
		return this.get("controllers.notification_center");
	},

	updateGuestNotification: function() {
		var name = "GuestNotification";
		var controller = this.getNotificationController();
		var message = "You're logged in as a guest user. Create an account to save your data.";

		controller.clearNamedAlert(name);

		if (!this.get('controllers.sessions.isUserRegistered')) {
			controller.alertInfo(message, {
				name: name,
				linkTo: 'setup_guest_user',
				linkText: 'Create an account'
			});
		}
	}.observes("controllers.sessions.isUserRegistered"),

	updateProductionMarketplaceNotification: function() {
		if (this.get("controllers.sessions.isUserRegistered") && !this.get("user.hasProductionMarketplace")) {
			var name = "SignUp";
			var controller = this.getNotificationController();
			var message = "Sign up for a production marketplace to transact live.";

			controller.clearNamedAlert(name);
			controller.alertInfo(message, {
				name: name,
				linkTo: 'marketplaces.apply',
				linkText: 'Register'
			});
		}
	}.observes("controllers.sessions.isUserRegistered", "user.hasProductionMarketplace"),

	updateBankAccountNotifications: function() {
		var name = "BankAccountVerification";
		var mp = this.get("marketplace");
		var controller = this.getNotificationController();

		if (mp && mp.get("isLoaded")) {
			Balanced.BankAccountVerificationMessage
				.forMarketplace(mp)
				.then(function(alert) {
					controller.clearNamedAlert(name);
					if (alert) {
						controller.alertError(alert.message, {
							name: name,
							linkTo: alert.linkTo,
							linkText: alert.linkText
						});
					}
				});
		}
	}.observes("marketplace.isLoaded"),

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
