Balanced.ApiKeySecretShowerComponent = Ember.Component.extend({
	showSecret: false,
	actions: {
		showKeySecret: function() {
			this.set('showSecret', true);
		}
	}
});
