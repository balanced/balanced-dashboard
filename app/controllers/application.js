Balanced.ApplicationController = Ember.Controller.extend({
	showNotificationCenter: true,

	// TODO - rename this to alert or flash
	notify: function(options) {
		this.set('notification', options);
	},

	notificationTransition: function() {
		var notification = this.get('notification');
		if(notification) {
			if(notification.persists) {
				notification.persists = false;
			} else {
				this.set('notification', null);
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
