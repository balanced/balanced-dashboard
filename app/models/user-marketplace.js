import Model from "./core/model";
import ModelArray from "./core/model-array";
import Rev0Serializer from "../serializers/rev0";

var loadArray = function(dependencyName, uri) {
	var klass = BalancedApp.__container__.lookupFactory(dependencyName);
	return ModelArray.newArrayLoadedFromUri(uri, klass);
};

var UserMarketplace = Model.extend({
	production: function() {
		return this.get('uri').indexOf('TEST') === -1;
	}.property('uri'),

	test: function() {
		return this.get('uri').indexOf('TEST') > -1;
	}.property('uri'),

	marketplace: function() {
		var Marketplace = BalancedApp.__container__.lookupFactory("model:marketplace");
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
		return loadArray("model:api-key", "/api_keys");
	}.property("marketplace"),

	marketplaceUsers: function() {
		return loadArray("model:user-invite", this.get("marketplace.users_uri"));
	}.property("marketplace.users_uri"),

	reloadMarketplaceUsers: function() {
		var array = loadArray("model:user-invite", this.get("marketplace.users_uri"));
		this.set("marketplaceUsers", array);
		return array;
	},

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
		var container = BalancedApp.__container__;
		var Auth = container.lookup("auth:main");
		var marketplaceUri = this.get("marketplace.users_uri");

		var usersArr = [{
			email_address: Auth.get('user.email_address'),
			created_at: this.get('keys.0.created_at'),
			noDelete: true
		}];

		var users = this.get("marketplaceUsers.content")
			.sort(function(u1, u2) {
				return u1.get('created_at') < u2.get('created_at') ? 1 : -1;
			});

		users.forEach(function(user) {
			user.set("uri", marketplaceUri);
		});
		usersArr.pushObjects(users);
		return usersArr;
	}.property('marketplaceUsers.@each')
});

UserMarketplace.reopenClass({
	serializer: Rev0Serializer.create()
});

export default UserMarketplace;
