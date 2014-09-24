import Ember from "ember";

var BaseConnection = Ember.Object.extend({
	settings: function(settings) {
		return settings;
	},

	post: function(url, data) {
		var self = this;
		return new Ember.RSVP.Promise(function(resolve, reject) {
			return self.ajax({
				url: url,
				data: data,
				type: "POST"
			}).then(resolve, reject);
		});
	},

	ajax: function(settings) {
		settings = this.settings(settings);
		return BalancedApp.Adapter.load(settings);
	},
});

export default BaseConnection;
