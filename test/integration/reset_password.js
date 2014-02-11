module('ResetPassword', {
	setup: function() {
		Testing.setupFixtures();
		Testing.logout();
	},
	teardown: function() {}
});

test('reset password page exists', function(assert) {
	visit('/password/abcdefghijklmnopq').then(function() {
		assert.equal($("form#reset-password-form").length, 1, 'The reset password form exists.');
	});
});

test('setting a weak password should error', function(assert) {
	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", '123456')
		.fillIn("form#reset-password-form input[name=password_confirm]", '123456')
		.click("form#reset-password-form button")
		.then(function() {
			assert.equal($("form#reset-password-form").hasClass('error'), true, 'reset password form should have error class');
		});
});

test('reset password form submits on button click', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", 'abcdef5')
		.fillIn("form#reset-password-form input[name=password_confirm]", 'abcdef5')
		.click("form#reset-password-form button").then(function() {
			assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');

			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.ResetPassword, '/password/abcdefghijklmnopq', sinon.match({
				password: 'abcdef5',
				password_confirm: 'abcdef5',
				token: 'abcdefghijklmnopq'
			})));
		});
});

test('reset password form submits on form submit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit('/password/abcdefghijklmnopq')
		.fillIn("form#reset-password-form input[name=password]", 'abcdef5')
		.fillIn("form#reset-password-form input[name=password_confirm]", 'abcdef5')
		.submitForm("form#reset-password-form").then(function() {
			assert.equal($("div#content div.alert-black").length, 1, 'The black confirmation box is visible');

			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.ResetPassword, '/password/abcdefghijklmnopq', sinon.match({
				password: 'abcdef5',
				password_confirm: 'abcdef5',
				token: 'abcdefghijklmnopq'
			})));
		});
});
