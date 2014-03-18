Balanced.UserMarketplace = Balanced.Model.extend({
	production: function() {
		return this.get('uri').indexOf('TEST') === -1;
	}.property('uri'),

	marketplace: function() {
		return Balanced.Marketplace.find(this.get('uri'));
	}.property('uri'),

	isEqual: function(a, b) {
		b = b || this;
		return Ember.get(a, 'secret') === Ember.get(b, 'secret');
	},

	updateSecret: function(newSecret) {
		this.set('secret', newSecret);
	},

	fullKeys: function() {
		var self = this;
		var knownKeys = this.get('keys');
		var secrets = {};
		var keyID;
		var keysArr = [];

		if (knownKeys) {
			knownKeys.forEach(function(key) {
				if (key.uri) {
					keyID = key.uri.replace(/.*\//, '');
					secrets[keyID] = key.secret;
				}
			});
		}

		Balanced.APIKey.findAll()
			.then(function(result) {
				var keys = result.content;
				var date1, date2;
				var secret;
				keys.sort(function(k1, k2) {
					date1 = k1.get('created_at');
					date2 = k2.get('created_at');

					return date1 < date2 ? 1 : -1;
				});

				keys.forEach(function(key) {
					secret = secrets[key.get('id')];

					if (secret) {
						key.set('secret', secret);
					}
				});

				keysArr.pushObjects(keys);
			});

		return keysArr;
	}.property('marketplace', 'keys'),

	users: function() {
		Balanced.UserInvite.reopen({
			uri: this.get('marketplace.users_uri')
		});

		return Balanced.UserInvite.findAll();
	}.property('marketplace')
});

Balanced.TypeMappings.addTypeMapping('user_marketplace', 'Balanced.UserMarketplace');

Balanced.Adapter.registerHostForType(Balanced.UserMarketplace, ENV.BALANCED.AUTH);

Balanced.UserMarketplace.reopenClass({
	serializer: Balanced.Rev0Serializer.create()
});
