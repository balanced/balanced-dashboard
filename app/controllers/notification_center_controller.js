var AlertMessage = Ember.Object.extend({
	expire: false,
});

Balanced.NotificationCenterController = Ember.ArrayController.extend({
	content: [],

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

Balanced.ModalNotificationCenterController = Balanced.NotificationCenterController.extend({
	content: [],
	alert: function(attributes) {
		var self = this;
		Balanced.Analytics.trackEvent(attributes.message, {
			type: attributes.type,
			path: self.get("container").lookup("controller:application").get('currentRouteName')
		});

		this._super(attributes);
	}
});
