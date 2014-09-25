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
		var Adapter = 1;
		settings = this.settings(settings);
		return BaseConnection.ADAPTER.load(settings);
	},
});

export default BaseConnection;
