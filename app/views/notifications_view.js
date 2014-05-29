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
	isBankAccountsEmpty: Ember.computed.equal('marketplaceBankAccounts.length', 0),
	isNeedsStartVerification: function(){
		var bankAccounts = this.get("marketplaceBankAccounts");
		if (bankAccounts) {
			return bankAccounts.any(function(bankAccount) {
					return bankAccount.get("can_verify");
			});
		}
		return false;
	}.property("marketplaceBankAccounts.@each.can_verify"),

	isNeedsConfirmVerification: function() {
		var bankAccounts = this.get("marketplaceBankAccounts");
		if (bankAccounts) {
			return bankAccounts.any(function(bankAccount) {
					return bankAccount.get("can_confirm_verification");
			});
		}
		return false;
	}.property("marketplaceBankAccounts.@each.can_confirm_verification"),
});

Balanced.NotificationMessageView = Balanced.View.extend({
	layoutName: "notifications/notification_message_layout"
});
