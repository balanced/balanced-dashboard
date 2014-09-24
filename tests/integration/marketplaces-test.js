module('Marketplaces.Index', {
	setup: function() {
		Testing.setupMarketplace();
		this.fakeRegisteredUser = function() {
			Ember.run(function() {
				Balanced.__container__.lookup("controller:sessions").set("isUserRegistered", true);
			});
		};
	},
	teardown: function() {
		Testing.restoreMethods(
			BalancedApp.Adapter.create,
			BalancedApp.Adapter.delete,
			Ember.Logger.error
		);
	}
});

test('view a marketplace sets the mru cookie', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.then(function() {
			Testing.selectMarketplaceByName();
			assert.equal(
				$.cookie(Balanced.COOKIE.MARKETPLACE_URI),
				'/marketplaces/' + Testing.MARKETPLACE_ID,
				'mru cookie is set'
			);
		});
});

test('view marketplace list', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.then(function() {
			assert.equal($('#marketplaces ul').find('a').first().text(), 'Test Marketplace');
		});
});

test('view single marketplace', function(assert) {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('#marketplaces ul a:contains("Test Marketplace")')
		.then(function() {
			assert.equal($('#marketplace-name').text().trim(), 'Test Marketplace');
		});
});

test('add test marketplace', function(assert) {
	// Stub error logger to reduce console noise.
	sinon.stub(Ember.Logger, "error");

	this.fakeRegisteredUser();

	var spy = sinon.spy(BalancedApp.Adapter, "create");
	Balanced.Auth.set('user.api_keys_uri', '/users/%@/api_keys'.fmt(Testing.CUSTOMER_ID));

	visit(Testing.MARKETPLACES_ROUTE)
		.fillForm(".marketplace-list.test li.mp-new form", {
			name: "NEW MARKETPLACE"
		})
		.click(".marketplace-list.test li.mp-new form button")
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Marketplace));
		});
});

test('add existing marketplace', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "create");
	this.fakeRegisteredUser();
	Balanced.Auth.set('user.marketplaces_uri', '/users/%@/marketplaces'.fmt(Testing.CUSTOMER_ID));

	visit(Testing.MARKETPLACES_ROUTE)
		.fillIn(".marketplace-list.production li.mp-new input[name='secret']", '1234')
		.click(".marketplace-list.production li.mp-new form button")
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('delete marketplace', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "delete");
	this.fakeRegisteredUser();
	Balanced.Auth.set('user.marketplaces_uri', '/users/' +
		Testing.CUSTOMER_ID + '/marketplaces');

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.click('#delete-marketplace .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
});

test('delete marketplace only deletes once despite multiple clicks', function(assert) {
	var stub = sinon.stub(BalancedApp.Adapter, "delete");
	this.fakeRegisteredUser();
	Balanced.Auth.set('user.marketplaces_uri', '/users/%@/marketplaces'.fmt(Testing.CUSTOMER_ID));

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.click('#delete-marketplace [name="modal-submit"]')
		.click('#delete-marketplace [name="modal-submit"]')
		.click('#delete-marketplace [name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
});
