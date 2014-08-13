var AlertMessage = Ember.Object.extend({
	expire: false,
	expires: function() {
		this.set("expire", true);
	}
});

Balanced.NotificationCenterController = Ember.ArrayController.extend({
	content: [],

	clearNamedAlert: function(name) {
		var cleanAlerts = this.rejectBy("name", name);
		this.set("content", cleanAlerts);
	},

	expireAlerts: function() {
		var cleanAlerts = this.rejectBy("expire");
		this.set("content", cleanAlerts);
	},

	alert: function(attributes) {
		var self = this;
		var message = AlertMessage.create(attributes);
		this.pushObject(message);
		return message;
	},

	alertError: function(message, options) {
		options = _.extend({
			message: message,
			type: "error"
		}, options);

		return this.alert(options);
	},
	alertSuccess: function(message, options) {
		options = _.extend({
			message: message,
			type: "success"
		}, options);
		return this.alert(options);
	},
});

Balanced.ModalNotificationCenterController = Balanced.NotificationCenterController.extend({
	content: []
});
