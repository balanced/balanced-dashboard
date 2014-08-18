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
	isProduction: Ember.computed.readOnly("marketplace.production"),
	isBankAccountsLoaded: Ember.computed.readOnly("bankAccounts.isLoaded"),

	isShowBankAccountNotifications: Ember.computed.and("isProduction", "isBankAccountsLoaded"),

	isAnyCanDebit: isAnyBankAccount("can_debit"),
	isAnyCanVerify: isAnyBankAccount("can_verify"),
	isAnyCanConfirmVerification: isAnyBankAccount("can_confirm_verification"),

	isBankAccountsEmpty: Ember.computed.equal("bankAccounts.length", 0),
	isNeedsStartVerification: function() {
		return this.get("isAnyCanVerify") && !this.get("isAnyCanDebit") && !this.get("isAnyCanConfirmVerification");
	}.property("isAnyCanVerify", "isAnyCanDebit", "isAnyCanConfirmVerification"),

	isNeedsConfirmVerification: function() {
		return this.get("isAnyCanConfirmVerification") && !this.get("isAnyCanDebit");
	}.property("isAnyCanConfirmVerification", "isAnyCanDebit")
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

		owner_customer: Ember.computed.oneWay("model.owner_customer"),

		bankAccountsNotificationsManager: function() {
			var marketplace = this.get("model");
			var bankAccounts = this.get("model.bank_accounts");

			return BankAccountsNotificationsManager.create({
				marketplace: marketplace,
				bankAccounts: bankAccounts
			});
		}.property("model", "model.bank_accounts"),

		updateBankAccountNotifications: function() {
			var message;

			if (this.get('bankAccountsNotificationsManager.isShowBankAccountNotifications')) {
				return;
			}

			if (this.get('bankAccountsNotificationsManager.isBankAccountsEmpty')) {
				message = "Your marketplace is not linked to any bank accounts. Add a bank account by visiting the settings page";
			} else if (this.get("bankAccountsNotificationsManager.isNeedsStartVerification")) {
				message = "You have unverified bank accounts. Start a verification by visiting the settings page.";
			} else if (this.get("bankAccountsNotificationsManager.isNeedsConfirmVerification")) {
				message = "Please verify your marketplace bank account by confirming the deposit amounts. Verify now";
			}

			if (message) {
				this.get("controllers.notification_center").alertError(message);
			}
		}.observes("bankAccountsNotificationsManager.isBankAccountsLoaded"),

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
