module('Balanced.Download');

test('properties map returns URI', function (assert) {
	var expectedProps = {
		email_address: 'bob@bob.com',
		uri: '/v1/downloads'
	};
	var user = Balanced.Download.create(expectedProps);
	var props = user._propertiesMap();
	assert.deepEqual(props, expectedProps);
});
