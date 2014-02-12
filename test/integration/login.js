module('Login', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.logout();
	},
	teardown: function() {}
});

test('login page exists and has correct fields', function(assert) {
	var spy = sinon.spy(Balanced.Auth, '_doSignIn');

	visit('/login')
		.then(function() {
			assert.equal($("form#auth-form").length, 1, 'The login form exists.');
			assert.equal($("form#auth-form input.ember-text-field").length, 2, '2 fields exist on the login form.');
			assert.equal($("form#auth-form button").length, 1, 'Submit button exist on the login form.');
		})
		.click('form#auth-form button')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".alert.alert-error").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
		});
});

test('login form submits correctly', function(assert) {
	var spy = sinon.spy(Balanced.Auth, '_doSignIn');

	visit('/login')
		.submitForm('form#auth-form')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly validated missing information.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".alert.alert-error").text().trim().toLowerCase().indexOf('is required') >= 0, 'Has error text');
		});
});

test('login page works', function(assert) {
	var spy = sinon.spy(Balanced.Auth, '_doSignIn');

	visit('/login')
		.fillForm('form#auth-form', {
			email: 'user@balancedpayments.com',
			password: '111111'
		}, {
			click: 'button'
		})
		.then(function() {
			assert.equal(spy.callCount, 1, 'Login form correctly errored.');
			assert.ok($("form#auth-form").hasClass('error'), 'Login form has an error.');
			assert.ok($(".alert.alert-error").text().trim().toLowerCase().indexOf('invalid') >= 0, 'Has error text');
		});
});
