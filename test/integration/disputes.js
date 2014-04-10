module('Disputes', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDisputes();

		// Pause tests for 10000ms for disputes
		// to be fully created
		Testing.pause(10000);
	},
	teardown: function() {}
});

test('exist on the activity page', function(assert) {
	var DISPUTES_ROUTE = Testing.MARKETPLACE_ROUTE + '/disputes';
	var activityDisputesPage = {
		'table.disputes tbody tr:eq(0) td.date.initiated': 1,
		'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
		'table.disputes tbody tr:eq(0) td.type': 'Pending',
		'table.disputes tbody tr:eq(0) td.account': 1,
		'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
		'table.disputes tbody tr:eq(0) td.amount': '$100.00',
		'table.disputes tfoot td:eq(0)': 1
	};

	visit(DISPUTES_ROUTE)
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 1, 'Correct # of Rows');

			// Manually check the disputes uri is correct
			var disputesController = Balanced.__container__.lookup('controller:disputes');
			assert.equal(disputesController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(disputesController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes Sort is correct');
		})
		.waitFor(function() {
			var result = $('table.disputes tfoot td:eq(0)').length >= 1;

			if (!result) {
				// Reolad the page
				visit(DISPUTES_ROUTE);
				wait();
			}

			return result;
		}, 'has "Load More" disputes')
		.checkElements(activityDisputesPage, assert)
		.click('table.disputes tfoot td.load-more-results a')
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 3, 'has more disputes');
		});
});

test('can download disputes', function(assert) {
	assert.equal($(".alert span").length, 0);
	var stub = sinon.stub(Balanced.Adapter, "create");
	stub.withArgs(Balanced.Download).callsArgWith(3, {
		download: {}
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click("a:contains('Disputes')")
		.click("#main #disputes .download")
		.fillIn(".download-modal.in form input[name='email']", "test@example.com")
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
		});
});

test('can visit page', function(assert) {
	var disputePage = {
		'#content h1': 'Dispute',
		'#dispute > .main-header .title': 1, // 'Brand New Electric Guitar Rosewood Fingerboard Sunset Red',
		'#dispute .customer-info .main-header .title': 1, // 'William Henry Cavendish III (whc@example.org)',
		'#dispute .transaction-details .dispute .tt-title': 'Pending: $100.00',
		'#dispute .transaction-details .debit .tt-title': 1 // 'Succeeded: $13.30'
	};

	visit(Testing.DISPUTE_ROUTE)
		.checkElements(disputePage, assert);
});
