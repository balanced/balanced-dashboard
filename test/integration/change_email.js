module('ChangeEmail', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('clicking change email from header menu brings up modal', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.then(function() {
			assert.equal($(".modal.change-email-modal.in").length, 1, 'The change email modal exists.');
			assert.ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is visible.');
		});
});

test('change email form submits', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");
	var USER_EMAIL = 'foo+1@bar.com';

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": USER_EMAIL
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.then(function() {
			assert.equal($(".change-email-modal form input[name=email]").val(), Testing.FIXTURE_USER_EMAIL, 'Email is filled in');
		})
		.fillForm('.change-email-modal form', {
			email: USER_EMAIL,
			existing_password: '123456',
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			assert.ok($(".modal.change-email-modal").is(":hidden"), 'The change email modal is hidden.');

			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.User, Testing.FIXTURE_USER_ROUTE, sinon.match({
				email: USER_EMAIL,
				existing_password: "123456",
			})));
		});
});

test('change email form errors if no email', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": "foo+1@bar.com",
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.fillForm('.change-email-modal form', {
			email: '',
			existing_password: '123456'
		}, {
			click: 'button[name=modal-submit]'
		})
		.click(".change-email-modal form button[name=modal-submit]")
		.then(function() {
			assert.ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is still visible.');
			assert.ok($(".modal.change-email-modal .alert-error").is(":visible"), 'The change email modal error is visible.');

			assert.equal(stub.callCount, 0);
		});
});


test('change email errors if no existing password', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "update");
	var USER_EMAIL = 'foo+1@bar.com';

	stub.callsArgWith(3, {
		"id": null,
		"admin": false,
		"email_address": USER_EMAIL
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click("#user-menu .change-email a")
		.fillForm('.change-email-modal form', {
			email: USER_EMAIL,
		}, {
			click: 'button[name=modal-submit]'
		})
		.then(function() {
			assert.ok($(".modal.change-email-modal.in").is(":visible"), 'The change email modal is still visible.');
			assert.ok($(".modal.change-email-modal .alert-error").is(":visible"), 'The change email modal error is visible.');

			assert.equal(stub.callCount, 0);
		});
});
