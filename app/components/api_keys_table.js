Balanced.ApiKeysTableComponent = Ember.Component.extend({
	oneKey: function() {
		return this.get('keys').length === 1;
	}.property('keys.@each'),
	haveOtherSecrets: function() {
		return this.get('keys').filterBy('secret').length > 1;
	}.property('keys.@each'),

	actions: {
		delete: function(key) {
			var self = this;
			var secret = key.get('secret');
			var newKey;
			if (secret === this.get('marketplaceSecret')) {
				newKey = this.get('keys').filterBy('secret').without(key)[0];
				if (!newKey) {
					return;
				}
				Balanced.Auth.setAPIKey(newKey.get('secret'));
				this.userMarketplace.updateSecret(newKey.get('secret'));
			}
			key.delete().then(function() {
				self.get('keys').removeObject(key);
			});
		}
	}

});
