import Ember from "ember";
import Utils from "balanced-dashboard/lib/utils";
import BankAccountVerificationMessage from "balanced-dashboard/lib/bank-account-verification-message";

var isSelected = function() {
	var routes = _.toArray(arguments);

	return function() {
		return routes.indexOf(this.get('controllers.application.currentRouteName')) >= 0;
	}.property('controllers.application.currentRouteName');
};

var MarketplaceController = Ember.ObjectController.extend({
	store: function() {
		var Ajax = require("balanced-dashboard/lib/ajax").default;
		var apiKey = Ember.get(Ajax, "defaultApiKey");
		return this.container.lookupFactory("store:balanced").create({
			apiKey: apiKey
		});
	}.property().volatile(),

	needs: ['application', 'notification_center', 'sessions'],

	isShowSearchBar: function() {
		return this.get("auth.signedIn") && this.get("model");
	}.property("auth.signedIn", "model"),

	transactionSelected: isSelected('marketplace.transactions', 'credits', 'debits', 'holds', 'refunds', 'reversals'),
	orderSelected: isSelected('marketplace.orders', 'orders'),
	customerSelected: isSelected('marketplace.customers', 'customer'),
	fundingInstrumentSelected: isSelected('marketplace.funding_instruments', 'bank_accounts', 'cards'),
	disputeSelected: isSelected('marketplace.disputes', 'dispute'),
	logSelected: isSelected('marketplace.logs', 'log'),
	invoiceSelected: isSelected('marketplace.invoices', 'invoice'),
	settingSelected: isSelected('marketplace.settings'),

	// Note: need this since bind-attr only works for a single property
	paymentSelected: Ember.computed.or('transactionSelected', 'orderSelected'),

	disputesResultsLoader: function() {
		if (this.get("model")) {
			return this.get('model').getDisputesLoader({
				statusFilters: 'pending',
				limit: 100
			});
		}
	}.property('model'),

	disputeAlertCount: function() {
		var length = this.get("disputesResultsLoader.results.length");

		if (length > 99) {
			length = "99+";
		}
		return length;
	}.property("disputesResultsLoader.results.length"),

	formattedEscrowAmount: function() {
		var escrow = this.get('in_escrow');
		if (isNaN(escrow)) {
			return '$--';
		}
		return Utils.formatCurrency(escrow);
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
			BankAccountVerificationMessage
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

export default MarketplaceController;
