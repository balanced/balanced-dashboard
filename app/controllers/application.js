Balanced.ApplicationController = Ember.Controller.extend({
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
		}
	}
});
