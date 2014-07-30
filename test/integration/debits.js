module('Debits', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Testing._createCard().then(function(card) {
				return Balanced.Debit.create({
					uri: card.get('debits_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 100000,
					description: 'Cocaine'
				}).save();
			}).then(function(debit) {
				Testing.DEBIT_ID = debit.get('id');
				Testing.DEBIT_URI = debit.get('uri');
				Testing.DEBIT_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/debits/' + Testing.DEBIT_ID;
			});
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create,
			Balanced.Adapter.update
		);
	}
});

test('can visit page', function(assert) {
	visit(Testing.DEBIT_ROUTE)
		.checkPageType("Debit", assert)
		.checkPageTitle("$1,000.00", assert);
});

test('can refund debit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.DEBIT_ROUTE)
		.click(".page-navigation a:contains(Refund)")
		.fillIn('#refund-debit .modal-body input[name="dollar_amount"]', "10")
		.click('#refund-debit .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].debit_uri, Testing.DEBIT_URI);
			assert.equal(spy.getCall(0).args[2].amount, '1000');
		});
});

test('failed debit shows failure information', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = Balanced.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.setProperties({
					status: "failed",
					failure_reason: "Foobar"
				});
			});
		})
		.checkElements({
			'.summary .status p:contains(Foobar)': 1
		}, assert);
});

test('failed debit does not show refund modal', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = Balanced.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.setProperties({
					status: "failed",
					failure_reason: "Foobar"
				});
			});
		})
		.checkElements({
			'#refund-debit:visible': 0
		}, assert);
});

test('renders metadata correctly', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = Balanced.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.set('meta', metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		}, assert);
});
