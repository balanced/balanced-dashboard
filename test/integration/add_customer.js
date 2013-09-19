module('Add Customer', {
	setup: function () {
		Testing.selectMarketplaceByName();

		// click the add customer
		$('li.add-customer a').click();
	}, teardown: function () {
	}
});

test('can visit page', function (assert) {
	//  check the page title has been selected
	var $title = $('#content h1');

	assert.equal($title.text().trim(), 'Add a customer', 'Title is not correct');
});

test('can create person customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
	// click on the person tab
	$("fieldset.application-type a.person").click();

	// open the additional section
	$(".disclosure-button a").click();

	// fill out info

	$('#add-customer input[name="name"]').val('TEST').trigger('keyup');
	$('#add-customer input[name="email"]').val('nick@example.com').trigger('keyup');
	$('#add-customer input[name="address.line1"]').val('1234 main street').trigger('keyup');
	$('#add-customer input[name="address.line2"]').val('Ste 400').trigger('keyup');
	$('#add-customer input[name="address.city"]').val('oakland').trigger('keyup');
	$('#add-customer input[name="address.country"]').val('USA').trigger('keyup');
	$('#add-customer input[name="address.region"]').val('ca').trigger('keyup');
	$('#add-customer input[name="address.postal_code"]').val('94612').trigger('keyup');
	$('#add-customer input[name="phone"]').val('1231231234').trigger('keyup');
	$('#add-customer input[name="dob_month"]').val('12').trigger('keyup');
	$('#add-customer input[name="dob_year"]').val('1930').trigger('keyup');
	$('#add-customer input[name="ssn_last4"]').val('1234').trigger('keyup');
	$('#add-customer input[name="facebook"]').val('kleinsch').trigger('keyup');
	$('#add-customer input[name="twitter"]').val('kleinsch').trigger('keyup');

	// click submit
	$(".actions button").click();

	// make sure we posted the customer
	assert.ok(spy.calledOnce);

	// should end up on the customer page
	assert.equal($('#content h1').text().trim(), 'Customer', 'Title is not correct');
});

test('can create business customer', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	// click on the business tab
	$("fieldset.application-type a.business").click();

	// open the additional section
	$(".disclosure-button a").click();

	// fill out info

	$('#add-customer input[name="business_name"]').val('Something Inc').trigger('keyup');
	$('#add-customer input[name="ein"]').val('123123123').trigger('keyup');

	$('#add-customer input[name="name"]').val('TEST').trigger('keyup');
	$('#add-customer input[name="email"]').val('nick@example.com').trigger('keyup');
	$('#add-customer input[name="address.line1"]').val('1234 main street').trigger('keyup');
	$('#add-customer input[name="address.line2"]').val('Ste 200').trigger('keyup');
	$('#add-customer input[name="address.city"]').val('oakland').trigger('keyup');
	$('#add-customer input[name="address.country"]').val('USA').trigger('keyup');
	$('#add-customer input[name="address.region"]').val('ca').trigger('keyup');
	$('#add-customer input[name="address.postal_code"]').val('94612').trigger('keyup');
	$('#add-customer input[name="phone"]').val('1231231234').trigger('keyup');
	$('#add-customer input[name="dob_month"]').val('12').trigger('keyup');
	$('#add-customer input[name="dob_year"]').val('1930').trigger('keyup');
	$('#add-customer input[name="ssn_last4"]').val('1234').trigger('keyup');
	$('#add-customer input[name="facebook"]').val('kleinsch').trigger('keyup');
	$('#add-customer input[name="twitter"]').val('kleinsch').trigger('keyup');

	// click submit
	$(".actions button").click();

	// make sure we posted the customer
	assert.ok(spy.calledOnce);

	// should end up on the customer page
	assert.equal($('#content h1').text().trim(), 'Customer', 'Title is not correct');
});
