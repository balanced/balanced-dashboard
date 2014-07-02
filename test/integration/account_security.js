module('Account Security', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Auth.request
		);
	}
});

test('Can enable', function(assert) {
	var spy = sinon.stub(Balanced.Auth, 'request')
		.returns(Ember.RSVP.resolve({
			id: "USxxxxxxxxxxxxxxx",
			secret: "VERYSECRET",
			secret_uri: "otpauth://xxxxxxxxxxxxxxxxxxxxxxx"
		}));

	visit('/security')
		.checkElements({
			"h1.page-title": 'Account Security',
			"#account_security.disabled": 1,
			".status-circle:visible": 2,
			".window-pane:visible": 0
		}, assert)
		.then(function() {
			var currentRoute = Balanced.__container__.lookup('route:accountSecurity');
			assert.equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.green a')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Enabled');
		});
});

test('Can see change password modal', function(assert) {
	visit('/security')
		.click('#user-menu .change-password a')
		.checkElements({
			'.change-password-modal.modal:visible': 1
		}, assert);
});

test('Can see change email modal', function(assert) {
	visit('/security')
		.click('#user-menu .change-email a')
		.checkElements({
			'.change-email-modal.modal:visible': 1
		}, assert);
});

test('Can disable', function(assert) {
	var spy = sinon.stub(Balanced.Auth, 'request')
		.returns(Ember.RSVP.resolve());;
	Balanced.Auth.set('user.otp_enabled', true);

	visit('/security')
		.checkElements({
			"h1.page-title": 'Account Security',
			"#account_security.enabled": 1,
			".status-circle:visible": 2,
			".window-pane:visible": 0
		}, assert)
		.then(function() {
			var currentRoute = Balanced.__container__.lookup('route:accountSecurity');
			assert.equal(currentRoute.previousHandler.name, 'login', 'Route to go back correct');
		})
		.click('.status-circle.red a')
		.checkElements({
			'#disable-mfa:visible': 1
		}, assert)
		.click('#disable-mfa button[name=modal-submit]')
		.then(function() {
			assert.equal(spy.callCount, 1, 'Disabled');
		});
});
