module('Credits', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createCredit();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.update,
			Balanced.Adapter.create
		);
	}
});

test('can visit page', function(assert) {
	visit(Testing.CREDIT_ROUTE)
		.checkPageTitle("Credit $100.00", assert);
});

test('can edit credit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			assert.ok(false, "Implement credit editing");
		});
	/*
		.click('.side-panel a.icon-edit')
		.fillIn('.edit-transaction.in .modal-body input[name=description]', "changing desc")
		.click('.edit-transaction.in .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Credit));
			assert.equal(spy.getCall(0).args[2].description, "changing desc");
		});
		*/
});

test('can reverse credit', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			assert.ok(false, "Implement credit editing");
		});

	/*
		.click('.credit a.reverse-credit-button')
		.fillIn('#reverse-credit .modal-body input[name=dollar_amount]', '10')
		.click('#reverse-credit.in .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
			assert.ok(spy.calledWith(Balanced.Reversal));
			assert.equal(spy.getCall(0).args[2].amount, 1000);

			assert.ok(!$('#reverse-credit.modal').is(':visible'), 'Modal Not Visible');
		});

	visit(Testing.CREDIT_ROUTE)
		.click('.credit a.reverse-credit-button')
		.then(function() {
			assert.equal($('#reverse-credit .modal-body input[name=dollar_amount]').val(), '90.00');
		})
		.click('#reverse-credit.in .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledTwice);
			assert.ok(spy.calledWith(Balanced.Reversal));
			assert.equal(spy.getCall(1).args[2].amount, 9000);

			assert.ok(!$('#reverse-credit.modal').is(':visible'), 'Modal Not Visible');
			assert.equal($('.credit a.reverse-credit-button').length, 0, 'No reverse credit buttons');
		});

	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			assert.equal($('.credit a.reverse-credit-button').length, 0, 'No reverse credit buttons');
		});
		*/
});

test('credit reversal errors', function(assert) {
	$.each(['-10000', '0'], function(e, amount) {
		visit(Testing.CREDIT_ROUTE)
			.then(function() {
				assert.ok(false, "Implement credit editing");
			});
		/*
			.click('.credit a.reverse-credit-button')
			.fillIn('#reverse-credit .modal-body input[name=dollar_amount]', amount)
			.click('#reverse-credit.in .modal-footer button[name=modal-submit]')
			.then(function() {
				assert.equal($('.control-group.error').is(':visible'), true);
			});
			*/
	});
});

test('reversing a credit with a comma in the amount will succeed', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");

	visit(Testing.CREDIT_ROUTE)
		.click('.page-navigation a:contains(Reverse)')
		.fillForm('#reverse-credit', {
			dollar_amount: "1,0",
			description: "Cool Reversal"
		})
		.click('#reverse-credit .modal-footer button[name=modal-submit]')
		.then(function() {
			assert.ok(spy.calledOnce);
			var firstCall = spy.getCall(0);
			assert.deepEqual(firstCall.args.slice(0, 3), [
				Balanced.Reversal,
				"/credits/" + Testing.CREDIT_ID + "/reversals", {
					amount: "1000",
					description: "Cool Reversal",
					credit_uri: "/credits/" + Testing.CREDIT_ID
				}
			]);
		});
});

test('renders metadata correctly', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "update");

	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			var controller = Balanced.__container__.lookup("controller:credits");
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
