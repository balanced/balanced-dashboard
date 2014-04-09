module('Balanced.NET.', {
	setup: function() {
		Testing.stop();
		Balanced.NET.loadCSRFToken().then(function() {
			Testing.start();
		});
	}
});

test('loadCSRFTokenIfNotLoaded', function(assert) {
	var existingToken = Balanced.NET.csrfToken;

	assert.ok(existingToken && existingToken.length > 0, 'Already has CSRF token');
	Balanced.NET.loadCSRFTokenIfNotLoaded();

	assert.equal(existingToken, Balanced.NET.csrfToken, 'Did not get new CSRF token');
});
