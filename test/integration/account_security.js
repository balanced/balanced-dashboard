module('Account Security', {
	setup: function() {
		Testing.setupFixtures();
		Testing.fixtureLogin();
	},
	teardown: function() {}
});

test('Can enable', function(assert) {
	var spy = sinon.spy(Balanced.Auth, 'enableMultiFactorAuthentication');

	visit('/security')
		.then(function() {
			assert.equal($("h1.page-title").text(), 'Account Security', 'The page title is correct');
			assert.ok($("#account_security").hasClass('disabled'), 'OTP is initially disabled.');
			assert.equal($(".status-circle:visible").length, 2, 'Status Circles exist');
			assert.equal($(".window-pane:visible").length, 0, 'Window Pane Hidden');

			var currentRoute = Balanced.__container__.lookup('route:accountSecurity');
			assert.equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.green a')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Enabled');
		});
});

test('Can disable', function(assert) {
	var spy = sinon.spy(Balanced.Auth, 'disableMultiFactorAuthentication');
	Balanced.Auth.set('user.otp_enabled', true);

	visit('/security')
		.then(function() {
			assert.equal($("h1.page-title").text(), 'Account Security', 'The page title is correct');
			assert.ok($("#account_security").hasClass('enabled'), 'OTP is initially disabled.');
			assert.equal($(".status-circle:visible").length, 2, 'Status Circles exist');
			assert.equal($(".window-pane:visible").length, 0, 'Window Pane Hidden');

			var currentRoute = Balanced.__container__.lookup('route:accountSecurity');
			assert.equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.red a')
		.then(function() {
			assert.ok($('#disable-mfa').is(':visible'), 'Disabled');
		})
		.click('#disable-mfa button[name=modal-submit]')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Disabled');
		});
});
