module('Balanced.Marketplaces.initial_deposit', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Debit.create,
			balanced.card.create
		);
	}
});

test('on the correct page', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE)
		.checkElements({
			"h1.page-title": "Make an initial deposit"
		}, assert);
});

test('form validation', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE)
		.click("#marketplace-initial-deposit button[name=modal-submit]")
		.checkElements({
			'.control-group.error': 3
		}, assert);
});

test('payment success', function(assert) {
	var CARD_URL = "/cards/" + Testing.CARD_ID;
	var spy = sinon.spy(Balanced.Debit, 'create');
	var tokenizingStub = sinon.stub(balanced.card, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: CARD_URL
		}]
	});

	visit(Testing.INITIAL_DEPOSIT_ROUTE)
		.fillForm({
			number: '4111 1111 1111 1111',
			cvv: '124',
			expiration_month: '12',
			expiration_year: '2020'
		})
		.click("#marketplace-initial-deposit button[name=modal-submit]")
		.then(function() {
			assert.ok(tokenizingStub.calledOnce, "Card was tokenized");
			assert.deepEqual(spy.firstCall.args[0], {
				amount: "1000",
				source_uri: CARD_URL,
				uri: CARD_URL + "/debits"
			});
		});
});

test('cancel', function(assert) {
	visit(Testing.INITIAL_DEPOSIT_ROUTE)
		.click('a.btn.secondary')
		.checkElements({
			"h1.page-title": "Transactions"
		}, assert);
});
