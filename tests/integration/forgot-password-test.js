module('ForgotPassword', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.logout();
	},
	teardown: function() {}
});

test('clicking forgot password from login takes you to the page', function(assert) {
	visit('/login')
		.click("form#auth-form a:eq(0)")
		.then(function() {
			assert.equal($("form#forgot-form").length, 1, 'The forgot form exists.');
		});
});

test('forgot password form submits', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "create");

	stub.callsArgWith(3, {
		"id": null,
		"email_address": "foo@bar.com"
	});

	visit('/forgot_password')
		.fillForm("#forgot-form", {
			"email_address": "foo@bar.com"
		}, {
			click: "button"
		})
		.onUrl('/login', assert)
		.then(function() {
			assert.equal($(".notification-center.success .message").length, 1, 'The confirmation message is visible');
			assert.ok(stub.calledOnce);
			assert.deepEqual(stub.firstCall.args.slice(1, 3), ["/password", {
				email_address: "foo@bar.com"
			}]);
		});
});

test('displays error message if email address was not found', function(assert) {
	visit('/forgot_password')
		.fillForm("#forgot-form", {
			"email_address": "foo12345@bar.com"
		}, {
			click: "button"
		})
		.then(function() {
			assert.equal($(".notification-center.error .message").length, 1, 'The error message is visible');
		});
});
