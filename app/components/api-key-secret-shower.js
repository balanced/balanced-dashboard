import Ember from "ember";

var ApiKeySecretShowerComponent = Ember.Component.extend({
	showSecret: false,
	actions: {
		showKeySecret: function() {
			this.set('showSecret', true);
		}
	}
});

export default ApiKeySecretShowerComponent;
