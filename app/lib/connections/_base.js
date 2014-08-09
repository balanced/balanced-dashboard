Balanced.Connections = {};

Balanced.Connections.BaseConnection = Ember.Object.extend({
	settings: function(settings) {
		return settings;
	},

	post: function(url, data) {
		return this.ajax({
			url: url,
			data: data,
			type: "POST"
		});
	},

	ajax: function(settings) {
		settings = this.settings(settings);
		return $.ajax(settings);
	},
});
