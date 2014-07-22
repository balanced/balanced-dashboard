module('Balanced.NET.');

asyncTest('loadCSRFTokenIfNotLoaded', function(assert) {
	Testing.stop();
	Balanced.NET.csrfToken = undefined;
	Balanced.NET.loadCSRFToken()
		.then(function() {
			var existingToken = Balanced.NET.csrfToken;

			assert.ok(existingToken && existingToken.length > 0, 'Already has CSRF token');
			Balanced.NET.loadCSRFTokenIfNotLoaded();

			assert.equal(existingToken, Balanced.NET.csrfToken, 'Did not get new CSRF token');
			Testing.start();
		});
});
