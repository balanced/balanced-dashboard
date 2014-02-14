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