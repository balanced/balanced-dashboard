var setupMarketplaceController = function(bankAccounts) {
	Ember.run(function() {
		var model = Balanced.__container__.lookup('controller:marketplace').get('model');
		model.set('owner_customer', Ember.Object.create({
			debits_uri: '/customers/' + Testing.CUSTOMER_ID + '/debits',
			credits_uri: '/customers/' + Testing.CUSTOMER_ID + '/credits',
			bank_accounts: bankAccounts,
			debitable_bank_accounts: bankAccounts
		}));
	});
};

module('Activity (non non-deterministic)', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {
		Testing.restoreMethods(
			Balanced.Adapter.create
		);
	}
});

test('Click load more shows 2 more and hides load more', function(assert) {
	Testing.setupActivity();

	visit(Testing.ACTIVITY_ROUTE)
		.then(function() {
			assert.equal($('#activity .results table.transactions tfoot td').length, 1, 'has "load more"');

			// Manually check the transactions uri is correct
			var activityController = Balanced.__container__.lookup('controller:activity_transactions');
			var results_uri = activityController.get('results_uri');
			assert.ok(activityController.get('results_base_uri').indexOf('/transactions') >= 0, 'Activity Transactions URI is correct');
			assert.ok(results_uri.indexOf('sort=created_at') > 0, 'Activity Transactions Sort is correct');
			assert.ok(results_uri.indexOf('card_hold') < 0, 'Activity URI filter by type is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') >= 0, 'Activity URI filter by status is correct');
		})
		.assertClick('#activity .results table.transactions tfoot td.load-more-results a', assert)
		.checkElements({
			"#activity .results table.transactions tbody tr": 4,
			"#activity .results table.transactions tfoot td": 0
		}, assert);
});

test('Filter Activity transactions table by type & status', function(assert) {
	Testing.setupActivity();

	visit(Testing.ACTIVITY_ROUTE)
		.click('#activity .results table.transactions th.type .type-filter li a:contains(Holds)')
		.then(function() {
			// Manually check the transactions uri is correct
			var activityController = Balanced.__container__.lookup('controller:activity_transactions');
			var results_uri = activityController.get('results_uri');
			assert.ok(activityController.get('results_base_uri').indexOf('/transactions') >= 0, 'Activity Transactions URI is correct');
			assert.ok(results_uri.indexOf('sort=created_at') > 0, 'Activity Transactions Sort is correct');
			assert.ok(results_uri.indexOf('type=card_hold') > 0, 'Activity Transactions Type is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') >= 0, 'Activity URI filter by status is correct');

			assert.equal($('#activity .results table.transactions tr td.no-results').length, 1, 'has "no results"');
		})
		.click('#activity .results table.transactions th.status .status-filter li a:contains(Succeeded)')
		.then(function() {
			var activityController = Balanced.__container__.lookup('controller:activity_transactions');
			var results_uri = activityController.get('results_uri');
			assert.ok(results_uri.indexOf('status=succeeded') >= 0, 'Activity URI filter by status is correct');
			assert.ok(results_uri.indexOf('status%5Bin%5D=failed%2Csucceeded%2Cpending') < 0, 'Activity URI filter by status is correct');

			assert.equal($('#activity .results table.transactions tr td.no-results').length, 1, 'has "no results"');
		})
		.click('#activity .results table.transactions th.type .type-filter li a:contains(Debits)')
		.then(function() {
			var activityController = Balanced.__container__.lookup('controller:activity_transactions');
			var results_uri = activityController.get('results_uri');
			assert.ok(results_uri.indexOf('type=debit') > 0, 'Activity Transactions Type is correct');
			assert.ok(results_uri.indexOf('status=succeeded') >= 0, 'Activity URI filter by status is correct');

			assert.equal($('#activity .results table.transactions tr td.no-results').length, 0, 'has no "no results"');
		});
});
