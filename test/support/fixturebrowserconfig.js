window.Balanced = window.Balanced || {};
window.Balanced.setupFixtureApp = function() {

	//  we don't actually care about hitting a server
	Ember.ENV.BALANCED.WWW = 'http://example.org';

	window.setupBalanced();
	Balanced.Adapter = Balanced.FixtureAdapter.create();
	Balanced.Adapter.asyncCallbacks = true;
	window.setupTestFixtures();

	// // Set up Ember Auth
	Ember.run(function() {
		var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
		Balanced.Auth.setAuthProperties(
			true,
			Balanced.User.find(userId),
			userId,
			userId,
			false);
	});
};
