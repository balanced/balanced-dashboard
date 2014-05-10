module("LoginController");

asyncTest('#afterLogin triggers auth.signInTransition', 1, function(assert) {
	var loginController = Balanced.__container__.lookup('controller:login');

	Balanced.Auth.one('signInTransition', function() {
		assert.ok(true);
		start();
	});

	loginController.afterLogin();
});
