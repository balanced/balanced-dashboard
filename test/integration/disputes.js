module('Disputes', {
	setup: function() {
		Testing.useFixtureData();
	},
	teardown: function() {}
});

test('can visit page', function(assert) {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var disputesController = Balanced.__container__.lookup('controller:marketplace_disputes');
	disputesController.reopen({
		minDate: moment('2013-08-01T00:00:00.000Z').toDate(),
		maxDate: moment('2013-08-01T23:59:59.999Z').toDate()
	});
	visit(DISPUTES_ROUTE)
		.then(function() {
			assert.equal(disputesController.get('results_base_uri'), '/disputes', 'Disputes URI is correct');
			assert.ok(disputesController.get('results_uri').indexOf('sort=initiated_at') > 0, 'Disputes sort is correct');
		})
		.checkElements({
			"#content h1": "Disputes",
			"#disputes table tbody tr": 2,
			'table.disputes tbody tr:eq(0) td.date.initiated': 1,
			'table.disputes tbody tr:eq(0) td.date.respond-by': 1,
			'table.disputes tbody tr:eq(0) td.status': 'pending',
			'table.disputes tbody tr:eq(0) td.account': 1,
			'table.disputes tbody tr:eq(0) td.funding-instrument': 1,
			'table.disputes tbody tr:eq(0) td.amount': '$2.00',
		}, assert);
});

test('can upload a dispute document', function(assert) {
	var DISPUTES_ROUTE = Testing.FIXTURE_MARKETPLACE_ROUTE + '/disputes';
	var DISPUTE_ROUTE = DISPUTES_ROUTE + '/DT2xOc7zAdgufK4XsCIW5QgD';
	var disputePage = {
		'#content h1': 'Dispute',
		'#dispute > .main-header .title': 1,
		'#dispute .customer-info .main-header .title': 1,
		'#dispute .transaction-details .debit .tt-title': 1,
		'#dispute .evidence-portal-info': 1
	};

	visit(DISPUTE_ROUTE)
		.then(function() {
			var disputeController = Balanced.__container__.lookup("controller:dispute");
			Ember.run(function() {
				disputeController.get('model').set('canUploadDocuments', true);
			});
		})
		.checkElements(disputePage, assert)
		.click('#dispute .evidence-portal-info a')
		.then(function() {
			assert.equal($('#evidence-portal .modal-header h2').text(), 'Attach docs');
			assert.equal($('#evidence-portal .fileinput-button').length, 1);
			// check that the upload prompt shows up
		})
		.then(function() {
			var disputeController = Balanced.__container__.lookup("controller:dispute");
			Ember.run(function() {
				disputeController.get('model').set('documents', [Balanced.DisputeDocument.create({
					"created_at": "2014-06-26T00:27:30.544797+00:00",
					"file_name": "test.jpg",
					"file_url": "http://www.balancedpayments.com",
					"guid": "DO9dJjGmyqbzDK5kXdp3fniy",
					"mime_type": "image/jpeg",
					"size": 129386,
					"updated_at": "2014-06-26T00:27:30.544821+00:00"
				})]);

				disputeController.get('model').set('canUploadDocuments', false);
			});
		})
		.then(function() {
			assert.equal($('#dispute div.documents table tr').length, 1, 'attached doc is displayed');
			assert.equal($('#dispute .evidence-portal-info a').length, 0, 'cannot attach docs after docs are uploaded');
		});
});
