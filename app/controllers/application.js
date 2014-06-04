Balanced.ApplicationController = Ember.Controller.extend(Ember.Evented, {
	showNotificationCenter: true,

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
		if (!this.get('auth.signedIn')) {
			return false;
		}

		if (this.get('currentRouteName') === 'marketplaces.index') {
			return false;
		}

		if (this.get('auth.newUpdates')) {
			this.set('newUpdatesModal', this.get('auth.newUpdates'));
		}

		return this.get('newUpdatesModal') === undefined;
	}.property('newUpdatesModal', 'auth.newUpdates'),

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
			var bankAccount = Balanced.currentMarketplace.get('owner_customer.bank_accounts.firstObject');
			this.transitionToRoute('bank_accounts', bankAccount).then(function(route) {
				_.delay(function() {
					var controller = route && route.routeName ?
						route.get('controller') :
						Balanced.__container__.lookup('controller:bank_accounts');

					if (!controller) {
						return;
					}

					if (bankAccount.get("can_verify")) {
						controller.trigger('openVerifyBankAccountModal');
					} else if (bankAccount.get("can_confirm_verification")) {
						controller.trigger("openConfirmVerificationModal");
					}

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
