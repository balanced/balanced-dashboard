Balanced.Connections = {};

Balanced.Connections.BaseConnection = Ember.Object.extend({
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
		return Balanced.Adapter.load(settings);
	},
});
