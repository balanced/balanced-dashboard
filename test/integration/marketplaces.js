module('Marketplaces.Index', {
	setup: function() {
		Testing.setupMarketplace();
		Balanced.Utils.setCurrentMarketplace(null);
	},
	teardown: function() {
		$("#delete-marketplace").modal('hide');
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
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.MARKETPLACES_ROUTE)
		.fillIn(".marketplace-list.test li.new input[name='name']", 'NEW MARKETPLACE')
		.click(".marketplace-list.test li.new form button")
		.then(function() {
			assert.ok(spy.calledWith(Balanced.Marketplace));
		});
});

test('add existing marketplace', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	Balanced.Auth.set('user.marketplaces_uri', '/users/' +
		Testing.CUSTOMER_ID + '/marketplaces');

	visit(Testing.MARKETPLACES_ROUTE)
		.fillIn(".marketplace-list.production li.new input[name='secret']", '1234')
		.click(".marketplace-list.production li.new form button")
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('delete marketplace', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "delete");
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
	var stub = sinon.stub(Balanced.Adapter, "delete");
	Balanced.Auth.set('user.marketplaces_uri', '/users/' +
		Testing.CUSTOMER_ID + '/marketplaces');

	visit(Testing.MARKETPLACES_ROUTE)
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.then(function() {
			for (var i = 0; i < 20; i++) {
				click('#delete-marketplace .modal-footer button[name="modal-submit"]');
			}
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
});
