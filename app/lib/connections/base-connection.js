import Ember from "ember";

var BaseConnection = Ember.Object.extend({
	settings: function(settings) {
		return settings;
	},

	post: function(url, data) {
		var self = this;
		return self.ajax({
			url: url,
			data: data,
			type: "POST"
		});
	},

	ajax: function(settings) {
		settings = this.settings(settings);
		return BaseConnection.ADAPTER.load(settings);
	},
});

export default BaseConnection;
