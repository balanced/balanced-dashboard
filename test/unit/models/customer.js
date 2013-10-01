module('Balanced.Customer');

test('displayName', function(assert) {
	var emailAddress = 'bob@example.org';
	var name = 'Bob';
	var businessName = 'Balanced';
	var customer = Balanced.Customer.create();
	customer.set('email', emailAddress);
	assert.equal(customer.get('displayName'), emailAddress);
	customer.set('name', name);
	assert.equal(customer.get('displayName'), '%@ (%@)'.fmt(name, emailAddress));
	customer.set('email', null);
	assert.equal(customer.get('displayName'), name);
	customer.set('business_name', businessName);
	customer.set('type', 'Business');
	assert.equal(customer.get('displayName'), businessName);
});
