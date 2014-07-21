Balanced.Connections = {};

Balanced.Connections.BaseConnection = Ember.Object.extend({
	settings: function(settings) {
		return settings;
	},

	ajax: function(settings) {
		return $.ajax(this.settings(settings));
	},
});
