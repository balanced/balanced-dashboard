Balanced.ApplicationController = Ember.Controller.extend(Ember.Evented, {
	showNotificationCenter: true,
	currentMarketplaceHasNoDebitableBankAccount: false,

	alert: function(options) {
		this.set('alertObj', options);
	},

	alertTransition: function() {
		var alert = this.get('alertObj');
		if (alert) {
			if (alert.persists) {
				alert.persists = false;
			} else {
				this.set('alertObj', null);
			}
		}
	},

	marketplaceHasNoDebitableBankAccount: function() {
		var currentMarketplace = this.get('auth.currentMarketplace');

		if (currentMarketplace && !currentMarketplace.get('isLoaded')) {
			return;
		}

		this.set('currentMarketplaceHasNoDebitableBankAccount',
			currentMarketplace && currentMarketplace.get('has_bank_account') && !currentMarketplace.get('has_debitable_bank_account'));
	}.observes('auth.currentMarketplace', 'auth.currentMarketplace.has_debitable_bank_account', 'auth.currentMarketplace.has_bank_account'),

	newUpdatesModal: function(key, token) {
		if (arguments.length === 1) { // get
			return $.cookie(Balanced.COOKIE.NEW_UPDATES) ? $.cookie(Balanced.COOKIE.NEW_UPDATES) : undefined;
		} else { // set
			$.cookie(Balanced.COOKIE.NEW_UPDATES, token, {
				path: '/',
				expires: Balanced.TIME.WEEK * 4,
			});
			return $.cookie(Balanced.COOKIE.NEW_UPDATES);
		}
	}.property(),

	displayNewUpdatesModal: function() {
		if (this.get('auth.newUpdates')) {
			this.set('newUpdatesModal', this.get('auth.newUpdates'));
		}

		return this.get('newUpdatesModal') === undefined;
	}.property('newUpdatesModal', 'auth.newUpdates'),

	hasGuestNotification: Ember.computed.readOnly('auth.isGuest'),
	hasBankAccountNotification: Ember.computed.readOnly('currentMarketplaceHasNoDebitableBankAccount'),
	hasNotification: Balanced.computed.orProperties('hasGuestNotification', 'hasBankAccountNotification'),

	actions: {
		closeNotificationCenter: function() {
			this.set('showNotificationCenter', false);
		},

		toggleNotificationCenter: function() {
			this.set('showNotificationCenter', !this.get('showNotificationCenter'));
		},

		closeNewUpdatesModal: function() {
			var date = new Date();
			this.set('newUpdatesModal', date);
			this.set('auth.newUpdates', date);
		},

		openChangePasswordModal: function() {
			if (this.get('auth.isGuest')) {
				return;
			}

			this.trigger('openChangePasswordModal');
		},

		openVerifyBankAccountLink: function() {
			this.transitionToRoute('bank_accounts', Balanced.currentMarketplace.get('owner_customer.bank_accounts.firstObject')).then(function(route) {
				_.delay(function() {
					var controller;

					if (route) {
						controller = route.get('controller');
					} else {
						controller = Balanced.__container__.lookup('controller:bank_accounts');
					}

					if (!controller) {
						return;
					}

					controller.trigger('openConfirmVerificationModal');
				});
			});
		},

		openChangeEmailModal: function() {
			if (this.get('auth.isGuest')) {
				return;
			}

			this.trigger('openChangeEmailModal');
		}
	}
});
