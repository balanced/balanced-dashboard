import Auth from "balanced-dashboard/auth";
import User from "balanced-dashboard/models/user";
import FixtureAdapter from "balanced-dashboard/adapters/fixture";

window.Balanced = window.Balanced || {};
window.Balanced.setupFixtureApp = function() {

	//  we don't actually care about hitting a server
	Ember.ENV.BALANCED.WWW = 'http://example.org';

	window.setupBalanced();
	BalancedApp.Adapter = FixtureAdapter.create();
	BalancedApp.Adapter.asyncCallbacks = true;
	window.setupTestFixtures();

	// // Set up Ember Auth
	Ember.run(function() {
		var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
		Auth.setAuthProperties(
			true,
			User.find(userId),
			userId,
			userId,
			false);
	});
};
