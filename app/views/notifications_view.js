Balanced.NotificationsView = Balanced.View.extend({
	templateName: "notifications/messages",

	marketplaceOwnerCustomer: Ember.computed.readOnly("marketplace.owner_customer"),
	marketplace: Ember.computed.readOnly("applicationController.auth.currentMarketplace"),

	marketplaceBankAccounts: function() {
		return this.get("isMarketplaceBankAccountsLoaded") ?
			this.get("marketplaceOwnerCustomer.bank_accounts") :
			undefined;
	}.property("isMarketplaceBankAccountsLoaded"),

	isMarketplaceProduction: Ember.computed.readOnly("marketplace.production"),
	isMarketplaceMissingDebitableBankAccount: Ember.computed.not("isMarketplaceHasDebitableBankAccount"),
	isMarketplaceBankAccountsLoaded: Ember.computed.readOnly("marketplaceOwnerCustomer.bank_accounts.isLoaded"),
	isMarketplaceBankAccountsEmpty: Ember.computed.equal('marketplaceBankAccounts.length', 0),
	isMarketplaceBankAccountsFull: Ember.computed.gt('marketplaceBankAccounts.length', 0),

	isMarketplaceHasDebitableBankAccount: function() {
		var bankAccounts = this.get("marketplaceBankAccounts");
		return bankAccounts ?
			bankAccounts.filterBy("can_debit").length > 0 :
			false;
	}.property("marketplaceBankAccounts.@each.can_debit"),

	hasGuestNotification: Ember.computed.readOnly('applicationController.auth.isGuest'),

	isMarketplaceVerificationMissing: Ember.computed.not("isMarketplaceBankAccountsVerificationStarted"),
	isMarketplaceBankAccountsVerificationStarted: function() {
		var bankAccounts = this.get("marketplaceBankAccounts") || [];
		return bankAccounts.any(function(bankAccount) {
			return bankAccount.get("bank_account_verification_uri") !== null;
		})
	}.property("marketplaceBankAccounts.@each.bank_account_verification_uri"),

	isBankAccountsEmpty: Ember.computed.and(
		"isMarketplaceProduction",
		"isMarketplaceBankAccountsLoaded",
		"isMarketplaceBankAccountsEmpty"
	),

	isNeedsStartVerification: Ember.computed.and(
		"isMarketplaceProduction",
		"isMarketplaceBankAccountsLoaded",
		"isMarketplaceBankAccountsFull",
		"isMarketplaceMissingDebitableBankAccount",
		"isMarketplaceVerificationMissing"
	),

	isNeedsConfirmVerification: Ember.computed.and(
		"isMarketplaceProduction",
		"isMarketplaceBankAccountsLoaded",
		"isMarketplaceBankAccountsFull",
		"isMarketplaceMissingDebitableBankAccount",
		"isMarketplaceBankAccountsVerificationStarted"
	),
});

Balanced.NotificationMessageView = Balanced.View.extend({
	layoutName: "notifications/notification_message_layout"
});
