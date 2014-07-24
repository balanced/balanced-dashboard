Balanced.ApplicationController = Ember.Controller.extend(Ember.Evented, {
	showNotificationCenter: true,

	alert: function(options) {
		var self = this;
		this.set('alertObj', options);
		if (options.reset > 0) {
			setTimeout(function() {
				if (!self.get("isDestroyed")) {
					self.set("alertObj", null);
				}
			}, options.reset);
		}
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

	actions: {
		closeNotificationCenter: function() {
			this.set('showNotificationCenter', false);
		},

		toggleNotificationCenter: function() {
			this.set('showNotificationCenter', !this.get('showNotificationCenter'));
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
