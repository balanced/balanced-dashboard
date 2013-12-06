module('ChangePassword', {
	setup: function() {
		Testing.setupFixtures();
		Testing.fixtureLogin();
	},
	teardown: function() {}
});

test('clicking change password from header menu brings up modal', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.then(function() {
			assert.equal($(".modal.change-password-modal.in").length, 1, 'The change password modal exists.');
			assert.ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is visible.');
		});
});

test('change password form submits', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
	// .then(function() {
	// assert.equal($(".change-password-modal form input[name=email]").val(), Testing.FIXTURE_USER_EMAIL, 'Email is filled in');
	// })
	.fillForm('.change-password-modal form', {
		// email: 'foo+1@bar.com',
		existing_password: '123456',
		password: '12345678',
		confirm_password: '12345678'
	}, {
		click: 'button[name=modal-submit]'
	})
		.then(function() {
			assert.ok($(".modal.change-password-modal").is(":hidden"), 'The change password modal is hidden.');

			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.User, Testing.FIXTURE_USER_ROUTE, sinon.match({
				confirm_password: "12345678",
				// email_address: "foo+1@bar.com",
				existing_password: "123456",
				password: "12345678"
			})));
		});
});

/*
test('change password form errors if no email', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			email: '',
			existing_password: '123456',
			password: '12345678',
			confirm_password: '12345678'
		}, {
			click: 'button[name=modal-submit]'
		})
		.click(".change-password-modal form button[name=modal-submit]")
		.then(function() {
			assert.ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is still visible.');
			assert.ok($(".modal.change-password-modal .alert-error").is(":visible"), 'The change password modal error is visible.');

			assert.equal(stub.callCount, 0);
		});
});
*/

test('change password errors if no existing password', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			password: '12345678',
			confirm_password: '12345678'
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			assert.ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is still visible.');
			assert.ok($(".modal.change-password-modal .alert-error").is(":visible"), 'The change password modal error is visible.');

			assert.equal(stub.callCount, 0);
		});
});

test('change password errors if passwords are different', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-password a")
		.fillForm('.change-password-modal form', {
			existing_password: '123456',
			password: '12345678',
			confirm_password: '666666'
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			assert.ok($(".modal.change-password-modal.in").is(":visible"), 'The change password modal is still visible.');
			assert.ok($(".modal.change-password-modal .alert-error").is(":visible"), 'The change password modal error is visible.');

			assert.equal(stub.callCount, 0);
		});
});
