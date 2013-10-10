module('Guest', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
	},
	teardown: function() {}
});

test('visiting start creates a marketplace', function(assert) {
	visit('/start').then(function() {
		assert.ok(window.location.hash.indexOf('start'), 'Transitioned to the start page');
		assert.equal(Balanced.Auth.get('userId'), '/users/guest', 'Userid is guest');
		assert.equal(Balanced.Auth.get('signedIn'), true, 'User is signed in');
		assert.ok(Balanced.Auth.get('isGuest'));
	});
});

test('viewing settings page as guest, can view api secret key', function(assert) {
	visit('/marketplaces/' + Balanced.TEST.MARKETPLACE_ID)
		.click('li.settings a')
		.click('.control-group .controls .api-key-secret a')
		.then(function() {
			var shown_api_secret_key = $('.control-group .controls .api-key-secret').text().trim();

			assert.ok(shown_api_secret_key, sinon.match(/^ak\-test/), 'shown api secret in settings for guest');
		});
});

test('claim account creates a login', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	var emailAddress = 'marshall@example.com',
		password = 'SupahSecret123~!';

	visit('/claim')
		.then(function() {
			assert.notEqual($('h1').text().trim().indexOf('Claim your account'), -1, 'title is correct');
			assert.equal($('[name="email_address"]').length, 1, 'email address is visible');
		})
		.fillIn('[name="email_address"]', emailAddress)
		.fillIn('[name="password"]', password)
		.fillIn('[name="passwordConfirm"]', password)
		.click('#claim-form button')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Claim, '/users', sinon.match({
				email_address: emailAddress,
				password: password
			})));
		});
});
