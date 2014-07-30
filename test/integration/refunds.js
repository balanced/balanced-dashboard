module('Refunds', {
	setup: function() {
		Testing.setupMarketplace();
		Ember.run(function() {
			Testing._createCard().then(function(card) {
				return Balanced.Debit.create({
					uri: card.get('debits_uri'),
					amount: 100000
				}).save();
			}).then(function(debit) {
				return Balanced.Refund.create({
					uri: debit.get('refunds_uri'),
					debit_uri: debit.get('uri'),
					amount: 10000
				}).save();
			}).then(function(refund) {
				Testing.REFUND_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/refunds/' + refund.get('id');
			});
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.update
		);
	}
});

test('can visit page', function(assert) {
	visit(Testing.REFUND_ROUTE)
		.checkPageType("Refund", assert)
		.checkPageTitle("$100.00", assert);
});

test('can edit refund', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.REFUND_ROUTE)
		.click('.key-value-display .edit-model-link')
		.fillIn('#edit-transaction .modal-body input[name=description]', "changing desc")
		.click('#edit-transaction .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Refund));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
});

test('renders metadata correctly', function(assert) {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.REFUND_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:refunds');
			Ember.run(function() {
				controller.set('model.meta', metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		}, assert);
});
