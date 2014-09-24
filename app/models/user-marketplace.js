import Model from "./core/model";
import Rev0Serializer from "../serializers/rev0";
import ApiKey from "./api-key";
import UserInvite from "./user-invite";
import Auth from "balanced-dashboard/auth";

var UserMarketplace = Model.extend({
	production: function() {
		return this.get('uri').indexOf('TEST') === -1;
	}.property('uri'),

	test: function() {
		return this.get('uri').indexOf('TEST') > -1;
	}.property('uri'),

	marketplace: function() {
		var Marketplace = require("balanced-dashboard/models/marketplace")["default"];
		return Marketplace.find(this.get('uri'));
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

		ApiKey.findAll()
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
		var MarketplaceUserInvite = UserInvite.extend({
			uri: this.get('marketplace.users_uri')
		});

		var usersArr = [{
			email_address: Auth.get('user.email_address'),
			created_at: this.get('keys.0.created_at'),
			noDelete: true
		}];

		MarketplaceUserInvite.findAll()
			.then(function(result) {
				var users = result.content;

				users.sort(function(u1, u2) {
					return u1.get('created_at') < u2.get('created_at') ? 1 : -1;
				});

				usersArr.pushObjects(users);
			});

		return usersArr;
	}.property('marketplace')
});

UserMarketplace.reopenClass({
	serializer: Rev0Serializer.create()
});

export default UserMarketplace;
