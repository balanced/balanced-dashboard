require('app/components/modal');

Balanced.ApiKeysModalComponent = Balanced.ModalComponent.extend({
	modalElement: '#api-keys',

	keys: [],

	addedKeys: [],

	keyName: '',

	init: function() {
		var self = this;
		Balanced.APIKey.findAll().then(function(result) {
			var keys = result.content;
			keys.sort(function(k1, k2) {
				return k1.get('created_at') > k2.get('created_at');
			});
			self.set('keys', keys);
		});
		window.debug = this;
		this._super();
	},

	keySecret: false,

	actions: {
		delete: function(key) {
			key.delete();
			var addedIndex = this.addedKeys.indexOf(key);
			if(addedIndex >= 0) {
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
				});
		},
		showKeySecret: function() {
			this.set('keySecret', true);
		}
	}

});