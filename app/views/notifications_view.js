// var isAnyBankAccount = function(propertyName) {
// 	return function() {
// 		var accounts = this.get("bankAccounts") || [];
// 		return accounts.isAny(propertyName);
// 	}.property("bankAccounts.@each." + propertyName);
// };

// var BankAccountsNotificationsManager = Ember.Object.extend({
// 	isProduction: Ember.computed.readOnly("marketplace.production"),
// 	isBankAccountsLoaded: Ember.computed.readOnly("bankAccounts.isLoaded"),

// 	isShowBankAccountNotifications: Ember.computed.and("isProduction", "isBankAccountsLoaded"),

// 	isAnyCanDebit: isAnyBankAccount("can_debit"),
// 	isAnyCanVerify: isAnyBankAccount("can_verify"),
// 	isAnyCanConfirmVerification: isAnyBankAccount("can_confirm_verification"),

// 	isBankAccountsEmpty: Ember.computed.equal("bankAccounts.length", 0),
// 	isNeedsStartVerification: function() {
// 		return this.get("isAnyCanVerify") && !this.get("isAnyCanDebit") && !this.get("isAnyCanConfirmVerification");
// 	}.property("isAnyCanVerify", "isAnyCanDebit", "isAnyCanConfirmVerification"),

// 	isNeedsConfirmVerification: function() {
// 		return this.get("isAnyCanConfirmVerification") && !this.get("isAnyCanDebit");
// 	}.property("isAnyCanConfirmVerification", "isAnyCanDebit")
// });

// Balanced.NotificationsView = Balanced.View.extend({
// 	templateName: "notifications/messages",

// 	marketplace: Ember.computed.oneWay("applicationController.auth.currentMarketplace"),
// 	bankAccountsNotificationsManager: function() {
// 		var marketplace = this.get("marketplace");
// 		var bankAccounts = this.get("marketplace.owner_customer.bank_accounts");
// 		return BankAccountsNotificationsManager.create({
// 			marketplace: marketplace,
// 			bankAccounts: bankAccounts
// 		});
// 	}.property("marketplace", "marketplace.owner_customer.bank_accounts"),

// 	hasGuestNotification: Ember.computed.readOnly('applicationController.auth.isGuest'),
// });



// Balanced.NotificationMessageView = Balanced.View.extend({
// 	layoutName: "notification_center"
// });
