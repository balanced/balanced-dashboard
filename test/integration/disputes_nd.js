module('Disputes (nd)', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDisputes();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

test('exist on the dispute page', function(assert) {
	var DISPUTES_ROUTE = Testing.MARKETPLACE_ROUTE + '/disputes';
	var activityDisputesPage = {
		'table.disputes tbody tr:eq(0) td.date.initiated': 1,
		'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
		'table.disputes tbody tr:eq(0) td.status': 'Pending',
		'table.disputes tbody tr:eq(0) td.account': 1,
		'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
		'table.disputes tbody tr:eq(0) td.amount': '$100.00',
		'table.disputes tfoot td:eq(0)': 1
	};
	Ember.run(function() {
		var disputesController = Balanced.__container__.lookup('controller:marketplaceDisputes');
		disputesController.set("limit", 2);
	});

	visit(DISPUTES_ROUTE)
		.then(function() {
			assert.ok($('table.disputes tbody tr').length >= 1, 'Correct # of Rows');

			// Manually check the disputes uri is correct
			var disputesController = Balanced.__container__.lookup('controller:marketplaceDisputes');
			assert.equal(disputesController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(disputesController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes Sort is correct');
		})
		.checkElements(activityDisputesPage, assert)
		.then(function() {
			var clickEl = 'table.disputes tfoot td.load-more-results a';
			if ($(clickEl).length > 0) {
				click(clickEl);
			} else {
				Ember.Logger.error("Element " + clickEl + " does not exist");
			}
		})
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
