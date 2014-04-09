module('Balanced.NET.');

test('loadCSRFTokenIfNotLoaded', function(assert) {
	var existingToken = Balanced.NET.csrfToken;

	assert.ok(existingToken.length > 0, 'Already has CSRF token');
	Balanced.NET.loadCSRFTokenIfNotLoaded();

	assert.equal(existingToken, Balanced.NET.csrfToken, 'Did not get new CSRF token');
});
