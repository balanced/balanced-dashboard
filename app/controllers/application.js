Balanced.ApplicationController = Ember.Controller.extend({
	notify: function(options) {
		this.set('notification', options);
	},

	notificationTransition: function() {
		var notification = this.get('notification');
		if(notification) {
			if(notification.persists) {
				notification.persists = false;
			} else {
				this.send('closeNotification');
			}
		}
	},

	actions: {
		closeNotification: function() {
			this.set('notification', null);
		}
	}
});
