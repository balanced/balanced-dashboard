module('Guest', {
	setup: function () {
		Ember.run(function () {
			Balanced.Auth.setAuthProperties(false, null, null, null, false);
			Balanced.Auth.forgetLogin();
		});
	}, teardown: function () {

	}
});

test('visiting start creates a marketplace', function (assert) {
	visit('/start').then(function() {
		assert.ok(window.location.hash.indexOf('start'), 'Transitioned to the start page');
		assert.equal(Balanced.Auth.get('userId'), '/users/guest', 'Userid is guest');
		assert.equal(Balanced.Auth.get('signedIn'), true, 'User is signed in');
		assert.ok(Balanced.Auth.get('isGuest'));
	});
});

test('viewing settings page as guest, can view api secret key', function(assert) {
	var apiKeySecret = '73ec8c8ef40611e2a318026ba7d31e6f';
	Ember.run(function() {
		Balanced.Auth.loginGuestUser(apiKeySecret);
		Balanced.Auth.setupGuestUserMarketplace(Balanced.Marketplace.find('/v1/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY'));
	});

	visit('/marketplaces/MP5m04ORxNlNDm1bB7nkcgSY').then(function() {
		return click('li.settings a');
	}).then(function() {
		return click('.control-group .controls .api-key-secret a');
	}).then(function() {
		var shown_api_secret_key = $('.control-group .controls .api-key-secret').text().trim();

		assert.equal(shown_api_secret_key, apiKeySecret, 'shown api secret in settings for guest');
	});
});

test('claim account creates a login', function (assert) {
	expect(3);

	var emailAddress = 'marshall@example.com',
		password = 'SupahSecret123~!';

	visit('/start')
	.visit('/claim')
	.then(function() {
		assert.notEqual($('h1').text().trim().indexOf('Claim your account'), -1, 'title is incorrect');
		assert.equal($('[name="email_address"]').length, 1, 'email address is visible');

		$('[name="email_address"]').val(emailAddress).keyup();
		$('[name="password"]').val(password).keyup();
		$('[name="passwordConfirm"]').val(password).keyup();
		return click('button', '#claim-form');
	}).then(function() {
		var expectedCalls = [
			{
				type: Balanced.Claim,
				data: {
					email_address: emailAddress,
					password: password
				}
			}
		];

		_.each(expectedCalls, function (e) {
			var match = 0;
			_.each(Balanced.Adapter.creates, function (create) {
				if (e.type !== create.type) {
					return;
				}
				_.each(e.data, function (d) {
					if (create.data[d] !== e.data[d]) {
						match = false;
						return;
					}
				});
				match = true;
			});
			assert.ok(match);
		});
	});
});
