import Testing from "../../helpers/testing";
import startApp from '../../helpers/start-app';
import Auth from "balanced-dashboard/auth";
import { test, moduleFor } from 'ember-qunit';

var App;

moduleFor("model:user-marketplace", "Model - UserMarketplace", {
	setup: function() {
		App	= startApp();
		Testing.setupMarketplace();
	},
	teardown: function() {
		Ember.fun(App, "destroy");
	},
});

test('fullKeys', function() {
	var userMarketplace = this.subject();
	Ember.run(function() {
		return userMarketplace.get('fullKeys');
	});

	var keys = userMarketplace.get('fullKeys');
	equal(keys.length, 1, 'Have one key');
	equal(Ember.get(keys[0], '_type'), 'api_key', 'Key is an instance of an api key');
	ok(Ember.get(keys[0], 'secret'), 'Key has a secret');
});

test('users', function() {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	Ember.run(function() {
		return userMarketplace.get('users');
	});

	var users = userMarketplace.get('users');
	equal(users.length, 1, 'Have No Other Users On Marketplace');
});

test('isTest', function() {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	equal(userMarketplace.get('production'), false, 'Is Test Marketplace');
});

test('marketplace', function() {
	var userMarketplace = Auth.get('user.user_marketplaces')[0];
	Ember.run(function() {
		return userMarketplace.get('marketplace');
	});

	var marketplace = userMarketplace.get('marketplace');
	ok(marketplace);
	equal(marketplace.get('_type'), 'marketplace', 'Is a marketplace');
});
