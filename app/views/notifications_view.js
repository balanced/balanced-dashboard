var isAnyBankAccount = function(propertyName, callback) {
	return function() {
		var bankAccounts = this.get("marketplaceBankAccounts");
		return bankAccounts ?
			bankAccounts.any(callback) :
			false;
	}.property(propertyName);
};

Balanced.NotificationsView = Balanced.View.extend({
	templateName: "notifications/messages",

	marketplaceOwnerCustomer: Ember.computed.readOnly("marketplace.owner_customer"),
	marketplace: Ember.computed.readOnly("applicationController.auth.currentMarketplace"),

	marketplaceBankAccounts: function() {
		var bankAccounts = this.get("marketplaceOwnerCustomer.bank_accounts");
		return bankAccounts && bankAccounts.get("isLoaded") ?
			bankAccounts : undefined;
	}.property("marketplaceOwnerCustomer.bank_accounts.isLoaded"),

	hasGuestNotification: Ember.computed.readOnly('applicationController.auth.isGuest'),

	hasUnverifiedBankAccount: isAnyBankAccount("marketplaceBankAccounts.@each.bank_account_verification_uri", function(bankAccount) {
		var uri = bankAccount.get("bank_account_verification_uri")
		return uri === undefined || uri === null;
	}),
	hasBankAccountVerification: isAnyBankAccount("marketplaceBankAccounts.@each.bank_account_verification_uri", function(bankAccount) {
		var uri = bankAccount.get("bank_account_verification_uri")
		return !(uri === undefined || uri === null);
	}),

	isBankAccountsEmpty: Ember.computed.equal('marketplaceBankAccounts.length', 0),
	isNeedsStartVerification: function() {
		return this.get("hasUnverifiedBankAccount") && !this.get("hasBankAccountVerification");
	}.property("hasUnverifiedBankAccount", "hasBankAccountVerification"),

	isNeedsConfirmVerification: isAnyBankAccount("marketplaceBankAccounts.@each.can_confirm_verification", function(bankAccount) {
		return bankAccount.get("can_confirm_verification");
	}),
});

Balanced.NotificationMessageView = Balanced.View.extend({
	layoutName: "notifications/notification_message_layout"
});
