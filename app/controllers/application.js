Balanced.ApplicationController = Ember.Controller.extend(Ember.Evented, {
	showNotificationCenter: true,

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
