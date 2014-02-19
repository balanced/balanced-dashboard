require('app/components/modal');

Balanced.ApiKeysModalComponent = Balanced.ModalComponent.extend({
	modalElement: '#api-keys',
	keys: [],
	addedKeys: [],
	keyName: '',
	keySecret: false,
	oneKey: function() {
		return (this.keys.length + this.addedKeys.length) === 1;
	}.property('keys.@each', 'addedKeys.@each'),
	haveOtherSecrets: function() {
		return this.addedKeys.length > 0;
	}.property('addedKeys.@each'),

	init: function() {
		var self = this;
		Balanced.APIKey.findAll()
			.then(function(result) {
				var keys = result.content;
				var date1, date2;
				keys.sort(function(k1, k2) {
					date1 = k1.get('created_at');
					date2 = k2.get('created_at');
					return date1 > date2 ? 1 : -1;
				});
				self.set('keys', keys);
			});
		this._super();
	},

	actions: {
		delete: function(key) {
			var addedIndex = this.addedKeys.indexOf(key);
			var secret = key.get('secret');
			var newKey;
			if (secret === this.get('marketplaceSecret')) {
				newKey = this.get('addedKeys')[0];
				if (!newKey) {
					return;
				}
				Balanced.Auth.setAPIKey(newKey.get('secret'));
				this.userMarketplace.updateSecret(newKey.get('secret'));
			}
			key.delete();
			if (addedIndex >= 0) {
				this.addedKeys.removeObject(key);
			}
		},

		createKey: function() {
			var self = this;
			Balanced.APIKey.create({
				meta: {
					name: self.keyName
				}
			}).save()
				.then(function(newKey) {
					self.addedKeys.pushObject(newKey);
					self.set('keyName', '');
					Balanced.UserMarketplace.create({
						uri: Balanced.Auth.user.api_keys_uri,
						secret: newKey.get('secret')
					}).save();
				});
		},

		showKeySecret: function() {
			this.set('keySecret', true);
		}
	}

});
