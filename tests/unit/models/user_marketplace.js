import Auth from "balanced-dashboard/auth";

moduleForModel("user-marketplace", "Model - UserMarketplace", {});

//module('Balanced.UserMarketplace', {
//	setup: function() {
//		Testing.setupMarketplace();
//	},
//	teardown: function() {}
//});

test('fullKeys', function(assert) {
	var userMarketplace = this.subject();
	Ember.run(function() {
		return userMarketplace.get('fullKeys');
	});

	var keys = userMarketplace.get('fullKeys');
	assert.equal(keys.length, 1, 'Have one key');
	assert.equal(Ember.get(keys[0], '_type'), 'api_key', 'Key is an instance of an api key');
	assert.ok(Ember.get(keys[0], 'secret'), 'Key has a secret');
});

test('users', function(assert) {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	Ember.run(function() {
		return userMarketplace.get('users');
	});

	var users = userMarketplace.get('users');
	assert.equal(users.length, 1, 'Have No Other Users On Marketplace');
});

test('isTest', function(assert) {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	assert.equal(userMarketplace.get('production'), false, 'Is Test Marketplace');
});

test('marketplace', function(assert) {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	Ember.run(function() {
		return userMarketplace.get('marketplace');
	});

	var marketplace = userMarketplace.get('marketplace');
	assert.ok(marketplace);
	assert.equal(marketplace.get('_type'), 'marketplace', 'Is a marketplace');
});
