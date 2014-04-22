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
	var stub = sinon.stub(Balanced.Adapter, "create");

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
			assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');
			assert.ok(stub.calledOnce);
			assert.deepEqual(stub.firstCall.args.slice(1, 3), ["/password", {
				email_address: "foo@bar.com"
			}]);
		});
});
