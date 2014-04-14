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

	marketplaceHasDebitableBankAccount: function() {
		return Balanced.currentMarketplace && Balanced.currentMarketplace.get('has_debitable_bank_account');
	}.property('Balanced.currentMarketplace.has_debitable_bank_account'),

	hasNotification: function() {
		return (!this.get('marketplaceHasDebitableBankAccount')) || this.get('auth.isGuest');
	}.property('marketplaceHasDebitableBankAccount', 'auth.isGuest'),

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

		openChangeEmailModal: function() {
			if (this.get('auth.isGuest')) {
				return;
			}

			this.trigger('openChangeEmailModal');
		}
	}
});
