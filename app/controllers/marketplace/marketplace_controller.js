var Computed = {
	isSelected: function() {
		var routes = _.toArray(arguments);

		return function() {
			return routes.indexOf(this.get('controllers.application.currentRouteName')) >= 0;
		}.property('controllers.application.currentRouteName');
	}
};

var isAnyBankAccount = function(propertyName) {
	return function() {
		var accounts = this.get("bankAccounts") || [];
		return accounts.isAny(propertyName);
	}.property("bankAccounts.@each." + propertyName);
};

var BankAccountsNotificationsManager = Ember.Object.extend({
	bankAccounts: Ember.computed.readOnly("marketplace.owner_customer.bank_accounts"),
	isShowBankAccountNotifications: Ember.computed.and("marketplace.production", "bankAccounts.isLoaded"),

	isBankAccountsEmpty: Ember.computed.equal("bankAccounts.length", 0),
	isAnyCanVerify: isAnyBankAccount("can_verify"),
	isAnyVerified: isAnyBankAccount("can_debit"),
	isNoneVerified: Ember.computed.not("isAnyVerified"),
	isAnyCanConfirmVerification: isAnyBankAccount("can_confirm_verification"),

	isNeedsConfirmVerification: function() {
		return this.get("isNoneVerified") && this.get("isAnyCanConfirmVerification");
	}.property("isNoneVerified", "isAnyCanConfirmVerification"),

	isNeedsStartVerification: function() {
		return this.get("isNoneVerified") && this.get("isAnyCanVerify");
	}.property("isNoneVerified", "isAnyCanVerify"),

	message: function() {
		if (this.get("isShowBankAccountNotifications")) {
			if (this.get('isBankAccountsEmpty')) {
				return "Your marketplace is not linked to any bank accounts. Add a bank account by visiting the settings page.";
			} else if (this.get("isNeedsConfirmVerification")) {
				return "Please verify your marketplace bank account by confirming the deposit amounts.";
			} else if (this.get("isNeedsStartVerification")) {
				return "You have unverified bank accounts. Start a verification by visiting the settings page.";
			}
		}
	}.property("isShowBankAccountNotifications", "isBankAccountsEmpty", "isNeedsConfirmVerification", "isNeedsStartVerification")
});

Balanced.MarketplaceController = Balanced.ObjectController.extend(
	Balanced.ActionEvented('openPaySellerModal', 'openChargeCardModal'), {

		needs: ['application', 'notification_center'],

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

		updateGuestNotification: function() {
			var name = "GuestNotification";
			var controller = this.get("controllers.notification_center");
			var message = "You're logged in as a guest user. Create an account to claim your test marketplace.";

			controller.clearNamedAlert(name);

			if (this.get('auth.isGuest')) {
				controller.alertInfo(message, {
					name: name
				});
			}
		}.observes("auth.isGuest"),

		bankAccountsNotificationsManager: function() {
			var marketplace = this.get("model");

			return BankAccountsNotificationsManager.create({
				marketplace: marketplace
			});
		}.property("model"),

		updateBankAccountNotifications: function() {
			var name = "BankAccountVerification";
			var controller = this.get("controllers.notification_center");
			var message = this.get("bankAccountsNotificationsManager.message");

			controller.clearNamedAlert(name);

			if (message) {
				controller.alertError(message, {
					name: name
				});
			}
		}.observes("bankAccountsNotificationsManager.message"),

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
