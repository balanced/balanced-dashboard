module('AddCustomer', {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	// check the page title has been selected
	visit(Testing.ADD_CUSTOMER_ROUTE).then(function() {
		var $title = $('#content h1');
		assert.equal($title.text().trim(), 'Add customer', 'Title is not correct');
	});
});

test('can create person customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.ADD_CUSTOMER_ROUTE)
		.click("fieldset.application-type a.person")
		.click(".disclosure-button")
		.fillForm('#add-customer', {
			name: 'TEST',
			email: 'nick@example.com',
			'address.line1': '1234 main street',
			'address.line2': 'Ste 400',
			'address.city': 'oakland',
			'address.state': 'ca',
			'address.postal_code': '94612',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1930',
			ssn_last4: '1234',
			facebook: 'kleinsch',
			twitter: 'kleinsch'
		})
		.fillIn('#add-customer .country-select', 'US')
		.click('.actions button')
		.then(function() {
			// make sure we posted the customer
			assert.ok(spy.calledOnce);

			// should end up on the customer page
			assert.equal($('#content .page-type').text().trim(), 'Customer', 'Title is not correct');

			// make sure we made the correct call with the proper object
			assert.ok(spy.calledWith(Balanced.Customer, '/customers', sinon.match({
				name: 'TEST',
				applicationType: 'PERSON',
				address: {
					city: "oakland",
					country_code: "US",
					line1: "1234 main street",
					line2: "Ste 400",
					postal_code: "94612",
					state: "ca"
				},
				dob_month: "12",
				dob_year: "1930",
				email: "nick@example.com",
				facebook: "kleinsch",
				phone: "1231231234",
				ssn_last4: "1234",
				twitter: "kleinsch"
			})));
		});
});

test('can create business customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.ADD_CUSTOMER_ROUTE)
		.click("fieldset.application-type a.business")
		.click(".disclosure-button")
		.fillForm('#add-customer', {
			business_name: 'Something Inc',
			ein: '123123123',
			name: 'TEST',
			email: 'nick@example.com',
			'address.line1': '1234 main street',
			'address.line2': 'Ste 200',
			'address.city': 'oakland',
			'address.state': 'ca',
			'address.postal_code': '94612',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1930',
			ssn_last4: '1234',
			facebook: 'kleinsch',
			twitter: 'kleinsch'
		})
		.fillIn('#add-customer .country-select', 'USA')
		.click('.actions button')
		.then(function() {
			// make sure we posted the customer
			assert.ok(spy.calledOnce);

			// should end up on the customer page
			assert.equal($('#content .page-type').text().trim(), 'Customer', 'Title is not correct');

			// make sure we made the correct call with the proper object
			assert.ok(spy.calledWith(Balanced.Customer, '/customers', sinon.match({
				name: "TEST",
				applicationType: "BUSINESS",
				business_name: "Something Inc",
				address: {
					city: "oakland",
					line1: "1234 main street",
					line2: "Ste 200",
					postal_code: "94612",
					state: "ca"
				},
				dob_month: "12",
				dob_year: "1930",
				ein: "123123123",
				email: "nick@example.com",
				facebook: "kleinsch",
				phone: "1231231234",
				ssn_last4: "1234",
				twitter: "kleinsch"
			})));
		});
});
