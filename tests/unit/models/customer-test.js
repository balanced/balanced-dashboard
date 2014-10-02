import Customer from "balanced-dashboard/models/customer";

module('Model - Customer');

test('displayName', function() {
	var emailAddress = 'bob@example.org';
	var name = 'Bob';
	var businessName = 'Balanced';
	var customer = Customer.create();
	customer.set('email', emailAddress);
	equal(customer.get('displayName'), emailAddress);
	customer.set('name', name);
	equal(customer.get('displayName'), '%@ (%@)'.fmt(name, emailAddress));
	customer.set('email', null);
	equal(customer.get('displayName'), name);
	customer.set('business_name', businessName);
	customer.set('type', 'Business');
	equal(customer.get('displayName'), businessName);
});
