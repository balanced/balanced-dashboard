var addCustomerRoutePath;

module('AddCustomer', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		addCustomerRoutePath = '/marketplaces/' + Balanced.TEST.MARKETPLACE_ID + '/add_customer';
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	// check the page title has been selected
	visit(addCustomerRoutePath).then(function() {
		var $title = $('#content h1');
		assert.equal($title.text().trim(), 'Add a customer', 'Title is not correct');
	});
});

test('can create person customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(addCustomerRoutePath)
		.click("fieldset.application-type a.person")
		.click(".disclosure-button")
		.fillIn('#add-customer input[name="name"]', 'TEST')
		.fillIn('#add-customer input[name="email"]', 'nick@example.com')
		.fillIn('#add-customer input[name="address.line1"]', '1234 main street')
		.fillIn('#add-customer input[name="address.line2"]', 'Ste 400')
		.fillIn('#add-customer input[name="address.city"]', 'oakland')
		.fillIn('#add-customer .country-select', 'US')
		.fillIn('#add-customer input[name="address.state"]', 'ca')
		.fillIn('#add-customer input[name="address.postal_code"]', '94612')
		.fillIn('#add-customer input[name="phone"]', '1231231234')
		.fillIn('#add-customer input[name="dob_month"]', '12')
		.fillIn('#add-customer input[name="dob_year"]', '1930')
		.fillIn('#add-customer input[name="ssn_last4"]', '1234')
		.fillIn('#add-customer input[name="facebook"]', 'kleinsch')
		.fillIn('#add-customer input[name="twitter"]', 'kleinsch')
		.click(".actions button")
		.then(function() {
			// make sure we posted the customer
			assert.ok(spy.calledOnce);

			// should end up on the customer page
			assert.equal($('#content h1').text().trim(), 'Customer', 'Title is not correct');

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

	visit(addCustomerRoutePath)
		.click("fieldset.application-type a.business")
		.click(".disclosure-button")
		.fillIn('#add-customer input[name="business_name"]', 'Something Inc')
		.fillIn('#add-customer input[name="ein"]', '123123123')
		.fillIn('#add-customer input[name="name"]', 'TEST')
		.fillIn('#add-customer input[name="email"]', 'nick@example.com')
		.fillIn('#add-customer input[name="address.line1"]', '1234 main street')
		.fillIn('#add-customer input[name="address.line2"]', 'Ste 200')
		.fillIn('#add-customer input[name="address.city"]', 'oakland')
		.fillIn('#add-customer .country-select', 'USA')
		.fillIn('#add-customer input[name="address.state"]', 'ca')
		.fillIn('#add-customer input[name="address.postal_code"]', '94612')
		.fillIn('#add-customer input[name="phone"]', '1231231234')
		.fillIn('#add-customer input[name="dob_month"]', '12')
		.fillIn('#add-customer input[name="dob_year"]', '1930')
		.fillIn('#add-customer input[name="ssn_last4"]', '1234')
		.fillIn('#add-customer input[name="facebook"]', 'kleinsch')
		.fillIn('#add-customer input[name="twitter"]', 'kleinsch')
		.click(".actions button")
		.then(function() {
			// make sure we posted the customer
			assert.ok(spy.calledOnce);

			// should end up on the customer page
			assert.equal($('#content h1').text().trim(), 'Customer', 'Title is not correct');

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
