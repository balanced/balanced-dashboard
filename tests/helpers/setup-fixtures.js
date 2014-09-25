import FixtureAdapter from "balanced-dashboard/adapters/fixture";
import User from "balanced-dashboard/models/user";

var setupFixtureApp = function() {
	BalancedApp.Adapter = FixtureAdapter.create();
	BalancedApp.Adapter.asyncCallbacks = true;

	var files = "dispute-documents disputes invoices marketplace marketplace-users user".split(" ");
	_.each(files, function(file) {
		var fixtures = require('balanced-dashboard/tests/fixtures/' + file)['default'];
		BalancedApp.Adapter.addFixtures(fixtures);
	});

	Ember.run(function() {
		var userId = '/users/USeb4a5d6ca6ed11e2bea6026ba7db2987';
		BalancedApp.__container__.lookup("auth:main").setAuthProperties(
			true,
			User.find(userId),
			userId,
			userId,
			false
		);
	});
};

export default setupFixtureApp;
