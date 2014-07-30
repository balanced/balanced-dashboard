module('Card Page', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

test('can view card page', function(assert) {
	visit(Testing.CARD_ROUTE)
		.checkPageType("Credit card", assert)
		.checkPageTitle("1111 Visa", assert);
});

test('debit card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Debit)")
		.checkElements({
			'label.control-label:contains(characters max):visible': "Appears on statement as (18 characters max)",
		}, assert)
		.then(function() {
			assert.equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'18'
			);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.click('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Debit, "/cards/" + Testing.CARD_ID + "/debits", sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Debit)")
		.fillForm("#debit-funding-instrument", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.clickMultiple('#debit-funding-instrument .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
		});
});

test('hold card', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Hold)")
		.then(function() {
			assert.ok($('#hold-card').is(':visible'), 'Hold Card Modal Visible');
		})
		.fillForm("#hold-card", {
			dollar_amount: "1000",
			description: "Test Hold"
		})
		.click("#hold-card .modal-footer button[name=modal-submit]")
		.then(function() {
			var expectedAttributes = {
				amount: 100000,
				description: "Test Hold",
				source_uri: "/cards/" + Testing.CARD_ID
			};

			var args = spy.firstCall.args;
			assert.ok(spy.calledOnce, "Balanced.Adapter.create called");
			assert.equal(args[0], Balanced.Hold);
			assert.equal(args[1], "/cards/" + Testing.CARD_ID + "/card_holds");
			_.each(expectedAttributes, function(value, key) {
				assert.equal(args[2][key], value);
			});
		});
});

test('holding only submits once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Hold)")
		.fillForm("#hold-card", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.clickMultiple('#hold-card .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(stub.calledOnce);

			Balanced.Adapter.create.restore();
		});
});

test('renders metadata correctly', function(assert) {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup("controller:cards");
			Ember.run(function() {
				controller.get("model").set("meta", metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		}, assert);
});
