var AlertMessage = Ember.Object.extend({
	expire: false,
	expires: function() {
		this.set("expire", true);
	}
});

Balanced.TemporaryAlertsController = Ember.ArrayController.extend({
	content: [],

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

	alertError: function(message) {
		return this.alert({
			message: message,
			type: "error"
		});
	},
	alertSuccess: function(message) {
		return this.alert({
			message: message,
			type: "success"
		});
	},
});
