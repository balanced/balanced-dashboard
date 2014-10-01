import Model from "./core/model";
import ModelArray from "./core/model-array";
import Rev0Serializer from "../serializers/rev0";

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

	marketplaceApiKeys: function() {
		var ApiKey = BalancedApp.__container__.lookupFactory("model:api-key");
		var uri = ApiKey.create().get("uri");
		return ModelArray.newArrayLoadedFromUri(uri, ApiKey);
	}.property("marketplace"),

	fullKeys: function() {
		var knownKeys = this.get('keys') || [];
		var secrets = {};

		knownKeys.forEach(function(key) {
			var keyUri = key.uri.replace(/^\/v1/, '');
			secrets[keyUri] = key.secret;
		});

		var keys = this.get("marketplaceApiKeys.content");
		keys.forEach(function(key) {
			var secret = secrets[key.get('uri')];
			if (secret) {
				key.set('secret', secret);
			}
		});
		return Ember.ArrayProxy.create({content: keys});
	}.property('marketplaceApiKeys.@each.uri', 'keys'),

	users: function() {
		var UserInvite = BalancedApp.__container__.lookupFactory("model:user-invite");
		var uri = this.get('marketplace.users_uri');

		var Auth = require("balanced-dashboard/auth")["default"];

		var usersArr = [{
			email_address: Auth.get('user.email_address'),
			created_at: this.get('keys.0.created_at'),
			noDelete: true
		}];

		ModelArray.newArrayLoadedFromUri(uri, UserInvite)
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
