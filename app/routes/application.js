var INFINITE_LOOP_DURATION_MILLIS = 2500;
var INFINITE_LOOP_NUM_ERRORS = 5;

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

Balanced.ApplicationRoute = Balanced.Route.extend(Ember.Evented, {
	init: function() {
		this.set('errorTimestamps', []);

		if (this.get('hasGuestNotification')) {
			this.controllerFor("notification_center")
				.alertError("You're logged in as a temporary guest user. Claim your account to save your data.");
		}
		if (this.get('isShowBankAccountNotifications')) {
			console.log(this.get('bankAccountsNotificationsManager'), this.get('bankAccountsNotificationsManager.isBankAccountsEmpty'))

			if (this.get('bankAccountsNotificationsManager.isBankAccountsEmpty')) {
				this.controllerFor("notification_center")
					.alertError("Your marketplace is not linked to any bank accounts. Add a bank account by visiting the settings page");
			}

			if (this.get("bankAccountsNotificationsManager.isNeedsStartVerification")) {
				this.controllerFor("notification_center")
					.alertError("You have unverified bank accounts. Start a verification by visiting the settings page.");
			}

			if (this.get("bankAccountsNotificationsManager.isNeedsConfirmVerification")) {
				this.controllerFor("notification_center")
					.alertError('Please verify your marketplace bank account by confirming the deposit amounts. Verify now');
			}
		}
	},

	marketplace: Ember.computed.oneWay("auth.currentMarketplace"),
	bankAccountsNotificationsManager: function() {
		var marketplace = this.get("marketplace");
		var bankAccounts = this.get("marketplace.owner_customer.bank_accounts");
		return BankAccountsNotificationsManager.create({
			marketplace: marketplace,
			bankAccounts: bankAccounts
		});
	}.property("marketplace", "marketplace.owner_customer.bank_accounts"),

	hasGuestNotification: Ember.computed.readOnly('auth.isGuest'),

	actions: {
		closeModal: function() {
			return this
				.container
				.lookup("controller:modals_container")
				.close();
		},
		openModal: function(klass) {
			var args = _.toArray(arguments).slice(1);
			return this
				.container
				.lookup("controller:modals_container")
				.open(klass, args);
		},

		error: function(error, transition) {
			if (!window.TESTING) {
				// Check for an infinite loop of error handling and short-circuit
				// if we've seen too many errors in too short a period
				var errorTimestamps = this.get('errorTimestamps');
				var currentTimestamp = new Date().getTime();
				errorTimestamps.push(currentTimestamp);
				if (errorTimestamps.length > INFINITE_LOOP_NUM_ERRORS) {
					var filtered = _.filter(errorTimestamps, function(t) {
						return t > currentTimestamp - INFINITE_LOOP_DURATION_MILLIS;
					});

					this.set('errorTimestamps', filtered);
					if (filtered.length > INFINITE_LOOP_NUM_ERRORS) {
						this.get('auth').forgetLogin();
						this.transitionTo('login');

						return;
					}
				}
			}

			// the error object could be an ember object or a jqxhr
			var statusCode = error.errorStatusCode || error.status;
			var uri = error.uri;

			Ember.Logger.error("Error while loading route (%@: %@): ".fmt(statusCode, uri), error.stack || error.message || error.name || error);

			// if we had a problem loading the marketplace, check that it's not the current
			// marketplace, since that might send us into an infinite loop
			if (error.get && error.get('uri') === this.get('auth').getLastUsedMarketplaceUri()) {
				this.get('auth').forgetLastUsedMarketplaceUri();
			}

			Balanced.Analytics.trackEvent('route-error', {
				type: 'error-loading-route',
				location: window.location.toString(),
				statusCode: statusCode
			});

			if (statusCode === 401 || statusCode === 403) {
				if (error.get && error.get('uri')) {
					// if we loaded an ember object and got a 401/403, let's forget about the transition
					this.get('auth').set('attemptedTransition', null);

					this.controllerFor("notification_center")
						.alertError('You are not permitted to access this resource.');
					this.transitionTo('marketplaces');
				} else if (transition) {
					this.get('auth').set('attemptedTransition', transition);

					// If we're not authorized, need to log in (maybe as a different user),
					// so let's log out
					this.get('auth').forgetLogin();
					this.transitionTo('login');
				}
			} else if (statusCode === 404) {
				this.controllerFor("notification_center")
					.alertError("Couldn't find the resource for this page, please make sure the URL is valid.");
				this.transitionTo('marketplaces');
			} else {
				this.controllerFor("notification_center")
					.alertError('There was an error loading this page.');
				this.transitionTo('marketplaces');
			}
		},

		willTransition: function() {
			this.controllerFor('marketplace.search').send('closeSearch');
			this.controllerFor('notification_center').expireAlerts();
		},

		signOut: function() {
			this.transitionTo('logout');
		}
	}
});
