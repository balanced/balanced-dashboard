module('Disputes', {
	setup: function() {
		// Testing.setupMarketplace();
		// Testing.createDispute();
		Testing.setupFixtures();
		Testing.fixtureLogin();
	},
	teardown: function() {}
});

test('exist on the activity page', function(assert) {
	var activityDisputesPage = {
		'table.disputes tbody tr td.date': '5 Dec \'13  5:53 PM',
		'table.disputes tbody tr td.type': 'Lost',
		// 'table.disputes tbody tr td.account': 'William Henry Cavendish III (whc@example.org)',
		// 'table.disputes tbody tr td.funding-instrument': '0005 (American Express)',
		'table.disputes tbody tr td.amount': '$1630.64'
	};

	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl/activity/disputes')
		.then(function() {
			assert.equal($('table.disputes tbody').length, 1, 'Correct Rows');
		})
		.then(function() {
			Ember.run.next(function() {
				_.each(activityDisputesPage, function(val, selector) {
					console.log(selector);
					assert.equal($(selector).text().trim(), val, 'Text for ' + selector);
				});
			});
		});
});

test('can visit page', function(assert) {
	var disputePage = {
		'#content h1': 'Dispute',
		'#dispute > .main-header .title': 1, // 'Brand New Electric Guitar Rosewood Fingerboard Sunset Red',
		'#dispute .customer-info .main-header .title': 1, // 'William Henry Cavendish III (whc@example.org)',
		'#dispute .transaction-details .dispute .transaction-type-subheader .title': 'Lost: $1630.64',
		'#dispute .transaction-details .debit .transaction-type-subheader .title': 1 // 'Succeeded: $13.30'
	};

	visit('/marketplaces/TEST-MP4cOZZqeAelhxXQzljLLtgl/disputes/DT2cada9485e1911e39ca9026ba7cd33d0')
		.then(function() {
			Ember.run.next(function() {
				_.each(disputePage, function(val, selector) {
					if (_.isNumber(val)) {
						assert.equal($(selector).length, val, 'Element exists ' + selector);
					} else {
						assert.equal($(selector).text().trim(), val, 'Text for ' + selector);
					}
				});
			});
		});
});
