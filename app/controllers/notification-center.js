import Ember from "ember";

var AlertMessage = Ember.Object.extend({
	expire: false,
});

var NotificationCenterController = Ember.ArrayController.extend({
	model: [],

	clearAlerts: function() {
		this.set("content", []);
	},

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

	alertInfo: function(message, options) {
		options = _.extend({
			message: message,
			type: "info"
		}, options);

		return this.alert(options);
	},

	alertWarning: function(message, options) {
		options = _.extend({
			message: message,
			type: "warning"
		}, options);

		return this.alert(options);
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

export default NotificationCenterController;
