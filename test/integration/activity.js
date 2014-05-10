function setupMarketplaceController(bankAccounts) {
	var model = Balanced.__container__.lookup('controller:marketplace').get('model');
	model.set('owner_customer', Ember.Object.create({
		debits_uri: '/customers/' + Testing.CUSTOMER_ID + '/debits',
		credits_uri: '/customers/' + Testing.CUSTOMER_ID + '/credits',
		bank_accounts: bankAccounts,
		debitable_bank_accounts: bankAccounts
	}));
}

module('Activity', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	visit(Testing.ACTIVITY_ROUTE)
		.checkElements({
			"#content h1": "Activity",
			'#activity li.download': 1
		}, assert);
});

test('Click load more shows 2 more and hides load more', function(assert) {
	visit(Testing.ACTIVITY_ROUTE)
		.then(function() {
			assert.equal($('#activity .results table.transactions tfoot td').length, 1, 'has "load more"');

			// Manually check the transactions uri is correct
			var activityController = Balanced.__container__.lookup('controller:activity');
			var results_uri = activityController.get('results_uri');
			assert.ok(activityController.get('results_base_uri').indexOf('/transactions') >= 0, 'Activity Transactions URI is correct');
			assert.ok(results_uri.indexOf('sort=created_at') > 0, 'Activity Transactions Sort is correct');
			assert.ok(results_uri.indexOf('card_hold') < 0, 'Activity URI filter by type is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') >= 0, 'Activity URI filter by status is correct');
		})
		.assertClick('#activity .results table.transactions tfoot td.load-more-results a', assert)
		.then(function() {
			assert.equal($('#activity .results table.transactions tbody tr').length, 4, 'has 4 transactions');
			assert.equal($('#activity .results table.transactions tfoot td').length, 0, 'does not have "load more"');
		});
});

test('Filter Activity transactions table by type & status', function(assert) {
	Testing.setupActivity();

	visit(Testing.ACTIVITY_ROUTE)
		.click('#activity .results table.transactions th.type .type-filter li a:contains(Holds)')
		.then(function() {
			// Manually check the transactions uri is correct
			var activityController = Balanced.__container__.lookup('controller:activity');
			var results_uri = activityController.get('results_uri');
			assert.ok(activityController.get('results_base_uri').indexOf('/transactions') >= 0, 'Activity Transactions URI is correct');
			assert.ok(results_uri.indexOf('sort=created_at') > 0, 'Activity Transactions Sort is correct');
			assert.ok(results_uri.indexOf('type=hold') > 0, 'Activity Transactions Type is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') >= 0, 'Activity URI filter by status is correct');

			// Check if it filters
			assert.equal($('#activity .results table.transactions tr td.no-results').length, 1, 'has "no results"');

			// Check header labels
			// Commenting out for now
			// assert.equal($('#activity .results nav li.transactions').text().indexOf('Holds') >= 0, 1, 'has correct text');
		})
		.click('#activity .results table.transactions th.status .status-filter li a:contains(Succeeded)')
		.then(function() {
			var activityController = Balanced.__container__.lookup('controller:activity');
			var results_uri = activityController.get('results_uri');
			assert.ok(results_uri.indexOf('status=succeeded') >= 0, 'Activity URI filter by status is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') < 0, 'Activity URI filter by status is correct');

			// Check if it filters
			assert.equal($('#activity .results table.transactions tr td.no-results').length, 1, 'has "no results"');

			// Check header labels
			// Commenting out for now
			// assert.equal($('#activity .results nav li.transactions').text().indexOf('Succeeded') >= 0, 1, 'has correct text');
		})
		.click('#activity .results table.transactions th.type .type-filter li a:contains(Debits)')
		.then(function() {
			var activityController = Balanced.__container__.lookup('controller:activity');
			var results_uri = activityController.get('results_uri');
			assert.ok(results_uri.indexOf('type=debit') > 0, 'Activity Transactions Type is correct');
			assert.ok(results_uri.indexOf('status=succeeded') >= 0, 'Activity URI filter by status is correct');

			// Check if it filters
			assert.equal($('#activity .results table.transactions tr td.no-results').length, 0, 'has no "no results"');
		});
});

test('add funds', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();
	var fundingInstrumentUri;

	visit(Testing.ACTIVITY_ROUTE).then(function() {
		setupMarketplaceController(bankAccounts);
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();
			fundingInstrumentUri = $("#add_funds_bank_account option:first").val();
			$("#add_funds_bank_account").val(fundingInstrumentUri);

			click('.activity-escrow-box .add-funds-btn')
				.then(function() {
					assert.equal($('#add-funds').css('display'), 'block', 'add funds modal visible');
					assert.equal($('#add-funds select option').length, 1, 'bank accounts in account dropdown');
					assert.equal(
						$('label.control-label:contains(characters max):visible').text(),
						'Appears on statement as (14 characters max)'
					);
					assert.equal(
						$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
						'14'
					);
				})
				.fillForm("#add-funds form", {
					"dollar_amount": "55.55",
					"appears_on_statement_as": "BALANCED TEST",
					"description": 'Adding lots of money yo'
				})
				.click("#add-funds [name=modal-submit]")
				.then(function() {
					assert.ok(spy.calledOnce);
					assert.ok(spy.calledWith(Balanced.Debit, fundingInstrumentUri + '/debits'));
					assert.equal(spy.getCall(0).args[2].amount, 5555);
					assert.equal(spy.getCall(0).args[2].description, 'Adding lots of money yo');
					spy.restore();
				});
		});
	});
});

test('add funds only adds once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();

	visit(Testing.ACTIVITY_ROUTE).then(function() {
		setupMarketplaceController(bankAccounts);
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();

			click('.activity-escrow-box .add-funds-btn')
				.fillForm("#add-funds", {
					dollar_amount: "55.55"
				})
				.click('#add-funds .modal-footer button[name="modal-submit"]')
				.click('#add-funds .modal-footer button[name="modal-submit"]')
				.click('#add-funds .modal-footer button[name="modal-submit"]')
				.click('#add-funds .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(stub.calledOnce);
					stub.restore();
				});
		});
	});
});

test('withdraw funds', function(assert) {
	var spy = sinon.spy(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();
	var fundingInstrumentUri;

	visit(Testing.ACTIVITY_ROUTE).then(function() {
		setupMarketplaceController(bankAccounts);
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();

			// Escrow balances are now cached
			// assert.equal($('.activity-escrow-box .amount .number1d').text().trim(), '$400.00', 'escrow amount is $400.00');

			// select the bank account
			fundingInstrumentUri = $("#withdraw-funds select[name='destination_uri'] option").eq(0).val();
			$("#withdraw-funds select[name='destination_uri']").val(fundingInstrumentUri);

			click('.activity-escrow-box .withdraw-funds-btn')
				.then(function() {
					assert.equal($('#withdraw-funds').css('display'), 'block', 'withdraw funds modal visible');
					assert.equal($('#withdraw-funds select option').length, 1, 'bank accounts in account dropdown');
					assert.equal(
						$('label.control-label:contains(characters max):visible').text(),
						'Appears on statement as (14 characters max)'
					);
					assert.equal(
						$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
						'14'
					);
				})
				.fillForm("#withdraw-funds form", {
					"dollar_amount": "55.55",
					"appears_on_statement_as": "BALANCED TEST",
					"description": 'Withdrawing some monies'
				})
				.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(spy.calledOnce);
					assert.ok(spy.calledWith(Balanced.Credit, fundingInstrumentUri + '/credits'));
					assert.equal(spy.getCall(0).args[2].amount, 5555);
					assert.equal(spy.getCall(0).args[2].description, 'Withdrawing some monies');
					spy.restore();
				});
		});
	});
});

test('withdraw funds only withdraws once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");
	var bankAccounts = Balanced.BankAccount.findAll();

	visit(Testing.ACTIVITY_ROUTE).then(function() {
		setupMarketplaceController(bankAccounts);
		Testing.stop();

		Ember.run.next(function() {
			Testing.start();

			click('.activity-escrow-box .withdraw-funds-btn')
				.fillForm('#withdraw-funds', {
					dollar_amount: "55.55"
				})
				.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
				.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
				.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
				.click('#withdraw-funds .modal-footer button[name="modal-submit"]')
				.then(function() {
					assert.ok(stub.calledOnce);
				});
		});
	});
});

test('download activity', function(assert) {
	assert.equal($(".alert span").length, 0);

	// var searchUri = "/marketplaces/" + Testing.MARKETPLACE_ID + "/search?limit=2&offset=0&q=&sort=created_at%2Cdesc&type%5Bin%5D=debit%2Ccredit%2Ccard_hold%2Crefund";

	// HACK - we have to mess with the URI since the CSV download service doesn't support rev1. When it does, switch this back to the above
	// var searchUri = "/v1/marketplaces/" + Testing.MARKETPLACE_ID + "/search?limit=2&offset=0&q=&sort=created_at%2Cdesc&type%5Bin%5D=debit%2Ccredit%2Chold%2Crefund";

	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click("#main #activity .icon-export.download")
		.fillForm(".download-modal.in form", {
			email: "test@example.com"
		})
		.click('.download-modal.in form .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Download, '/downloads', {
				email_address: "test@example.com",
				uri: "",
				type: "transactions"
			}));
			assert.equal($(".alert span").length, 1);
			assert.equal($(".alert span").text(), "We're processing your request. We will email you once the exported data is ready to view.");
		});
});

test('download disputes', function(assert) {
	assert.equal($(".alert span").length, 0);
	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click("a:contains('Disputes')")
		.click("#main #activity .icon-export.download")
		.fillForm(".download-modal.in form", {
			email: "test@example.com"
		})
		.click('.download-modal.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			assert.ok(stub.calledWith(Balanced.Download, '/downloads', {
				email_address: "test@example.com",
				uri: "",
				type: "disputes"
			}));
			assert.equal($(".alert span").length, 1);
			assert.equal($(".alert span").text(), "We're processing your request. We will email you once the exported data is ready to view.");
			stub.restore();
		});
});

test('download activity only runs once despite multiple clicks', function(assert) {
	var stub = sinon.stub(Balanced.Adapter, "create");

	visit(Testing.ACTIVITY_ROUTE)
		.click("#main #activity .icon-export.download")
		.fillForm(".download-modal.in form", {
			email: 'test@example.com'
		})
		.click('.download-modal.in .modal-footer button[name="modal-submit"]')
		.click('.download-modal.in .modal-footer button[name="modal-submit"]')
		.click('.download-modal.in .modal-footer button[name="modal-submit"]')
		.click('.download-modal.in .modal-footer button[name="modal-submit"]')
		.then(function() {
			assert.ok(stub.calledOnce);
			stub.restore();
		});
});

test('transactions date sort has two states', function(assert) {
	var objectPath = "#activity .results th.date";
	var states = [];
	var count = 0;
	var testAmount = 5;

	var getState = function() {
		if ($(objectPath).hasClass("unsorted")) {
			if ($.inArray("unsorted", states) === -1) {
				states.push("unsorted");
			}
		} else if ($(objectPath).hasClass("ascending")) {
			if ($.inArray("ascending", states) === -1) {
				states.push("ascending");
			}
		} else if ($(objectPath).hasClass("descending")) {
			if ($.inArray("descending", states) === -1) {
				states.push("descending");
			}
		}

		count++;
		if (count !== testAmount) {
			click($(objectPath)).then(getState);
		} else {
			states.sort();

			var expectedStates = ["ascending", "descending"];
			assert.equal(states[0], expectedStates[0]);
			assert.equal(states[1], expectedStates[1]);
			assert.equal(states.length, 2);
		}
	};

	visit(Testing.ACTIVITY_ROUTE)
		.click($(objectPath)).then(getState);
});
