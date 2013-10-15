var marketplaceIndexRoute;

module('Marketplaces.Index', {
	setup: function() {
		Balanced.TEST.setupMarketplace();
		marketplaceIndexRoute = '/marketplaces';
	},
	teardown: function() {
		$("#delete-marketplace").modal('hide');
	}
});

test('view a marketplace sets the mru cookie', function(assert) {
	visit(marketplaceIndexRoute)
		.then(function() {
			Testing.selectMarketplaceByName();
			assert.equal(
				$.cookie(Balanced.COOKIE.MARKETPLACE_URI),
				'/v1/marketplaces/' + Balanced.TEST.MARKETPLACE_ID,
				'mru cookie is set'
			);
		});
});

test('view marketplace list', function(assert) {
	visit(marketplaceIndexRoute)
		.then(function() {
			assert.equal($('#marketplaces ul').find('a').first().text(), 'Test Marketplace');
		});
});

test('view single marketplace', function(assert) {
	visit(marketplaceIndexRoute)
		.click('#marketplaces ul a:contains("Test Marketplace")')
		.then(function() {
			assert.equal($('#marketplace-name').text().trim(), 'Test Marketplace');
		});
});

test('add test marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(marketplaceIndexRoute)
		.fillIn(".marketplace-list.test li.new input[name='name']", 'NEW MARKETPLACE')
		.click(".marketplace-list.test li.new form button")
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.UserMarketplace));
			assert.equal(spy.getCall(0).args[1], '/users/' + Balanced.TEST.CUSTOMER_ID + '/marketplaces');
			assert.equal(spy.getCall(0).args[2].name, 'NEW MARKETPLACE');
		});
});

test('add existing marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(marketplaceIndexRoute)
		.fillIn(".marketplace-list.production li.new input[name='secret']", '1234')
		.click(".marketplace-list.production li.new form button")
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.UserMarketplace, '/users/' + Balanced.TEST.CUSTOMER_ID + '/marketplaces', sinon.match({
				secret: '1234'
			})));
		});
});

test('delete marketplace', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var initialLength;

	visit(marketplaceIndexRoute)
		.then(function() {
			initialLength = $(".marketplace-list.test li").length;
		})
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.click('#delete-marketplace .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce, "Delete should have been called once");

			// Can't check this bc guest users can't add/delete marketplaces
			// assert.equal($(".marketplace-list.test li").length, initialLength - 1);
		});
});

test('delete marketplace only deletes once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "delete");

	visit(marketplaceIndexRoute)
		.click(".marketplace-list.test li:first-of-type .icon-delete")
		.then(function() {
			for (var i = 0; i < 20; i++) {
				click('#delete-marketplace .modal-footer button[name="modal-submit"]');
			}
			assert.ok(stub.calledOnce, "Delete should have been called once");
		});
});
