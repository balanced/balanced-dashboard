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

	actions: {
		closeNotificationCenter: function() {
			this.set('showNotificationCenter', false);
		},

		toggleNotificationCenter: function() {
			this.set('showNotificationCenter', !this.get('showNotificationCenter'));
		},

		openChangePasswordModal: function() {
			this.trigger('openChangePasswordModal');
		},

		openChangeEmailModal: function() {
			this.trigger('openChangeEmailModal');
		}
	}
});
