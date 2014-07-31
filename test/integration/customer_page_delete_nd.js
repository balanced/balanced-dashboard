module("Customer Page: Delete (Non deterministic)", {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter["delete"]
		);
	}
});

test('can delete bank account', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var initialLength, href;

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var elements = $('.results .funding-instruments tr.type-bank-account .funding-instrument-delete');
			initialLength = elements.length;
			href = elements.last().attr("data-item-href");
		})
		.click('.results .funding-instruments tr.type-bank-account .funding-instrument-delete:last')
		.click('#delete-bank-account button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;

			assert.equal($(".results .funding-instruments tr.type-bank-account").length, initialLength - 1);
			assert.ok(spy.calledOnce, "Balanced.Adapter.deleted calledOnce");
			assert.deepEqual(args.slice(0, 2), [Balanced.BankAccount, href]);
		});
});

test('can delete cards', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "delete");
	var initialLength, href;

	visit(Testing.CUSTOMER_ROUTE)
		.then(function() {
			var elements = $('.results .funding-instruments tr.type-card .funding-instrument-delete');
			initialLength = elements.length;
			href = elements.last().attr("data-item-href");
		})
		.click('.results .funding-instruments tr.type-card .funding-instrument-delete:last')
		.click('#delete-card button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;

			assert.equal($(".results .funding-instruments tr.type-card").length, initialLength - 1);
			assert.ok(spy.calledOnce, "Balanced.Adapter.deleted calledOnce");
			assert.deepEqual(args.slice(0, 2), [Balanced.Card, href]);
		});
});
