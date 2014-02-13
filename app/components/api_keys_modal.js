require('app/components/modal');

Balanced.ApiKeysModalComponent = Balanced.ModalComponent.extend({
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
				// this.addedKeys.arrayContentWillChange(addedIndex, 1, 0);
				this.addedKeys.removeObject(key);
				// this.addedKeys.arrayContentDidChange(addedIndex, 1, 0);
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
					// self.addedKeys.arrayContentWillChange(self.addedKeys.length, 0, 1);
					self.addedKeys.pushObject(newKey);
					// self.addedKeys.arrayContentDidChange(self.addedKeys.length, 0, 1);
					self.set('keyName', '');
					// var addedKeys = [];
					// $.each(self.addedKeys, function(i, key) {
					// 	addedKeys.push(key);
					// });
					// addedKeys.push(newKey);
					// self.set('addedKeys', addedKeys);
				});
		},
		showKeySecret: function() {
			this.set('keySecret', true);
		}
	}

});