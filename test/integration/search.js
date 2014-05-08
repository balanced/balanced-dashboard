module('Search', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
		Balanced.Auth.set('signedIn', true);

		Testing.setupSearch();
	},
	teardown: function() {
		Ember.run(function() {
			$('#search .search-close').click();
		});
	}
});

test('search box exists', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			assert.equal($('#q').length, 1);
		});
});

test('search results show and hide', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('Cocaine');
		})
		.then(function() {
			assert.equal($('#search').hasClass('with-results'), true, 'search has no results');
			assert.equal($('body').hasClass('overlaid'), true, 'overlay not showing');
		})
		.then(function() {
			Testing.runSearch('');
		})
		.then(function() {
			assert.equal($('#search').hasClass('with-results'), false, 'blank search has results');
			assert.equal($('body').hasClass('overlaid'), false, 'overlay still showing');
		});
});

test('search results hide on click [x]', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .search-close')
		.then(function() {
			assert.equal($('#q').val(), '');
			assert.equal($('#search').hasClass('with-results'), false);
			assert.equal($('#main-overlay').css('display'), 'none');
			assert.equal($('body').hasClass('overlaid'), false);
		});
});

test('search "%" returns 4 transactions total, showing 2 transactions in results, with load more', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			assert.equal($('#search .results li.transactions > a:contains("4")').length, 1, 'has 4 transactions in header');
			assert.equal($('#search .results table.transactions tbody tr').length, 2, 'has 2 transactions');
			assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');

			// Manually check the transactions uri is correct
			var controller = Balanced.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			assert.ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			assert.ok(resultsUri.indexOf('card_hold') >= 0, 'Search URI filter by type is correct');
		})
		.click('#search .results th.type ul.dropdown-menu li a:contains(Holds)')
		.then(function() {
			// Manually check the transactions uri is correct
			var controller = Balanced.__container__.lookup('controller:search');
			var resultsUri = controller.get('results_uri');
			assert.ok(controller.get('results_base_uri').indexOf('/search') >= 0, 'Search Transactions URI is correct');
			assert.ok(resultsUri.indexOf('type=card_hold') > 0, 'Search Transactions Type is correct');

			// Check if it filters
			assert.equal($('#search .results table.transactions tr td.no-results').length, 1, 'has "no results"');
		});
});

test('search "%", click customers, returns 1 customer total, showing 1 customer in results, with no load more', function(assert) {
	Testing.setupSearch(1, 'customer');

	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			assert.equal($('#search .results li.customers > a:contains("1")').length, 1, 'has 1 customer in header');
		})
		.click('#search .results .customers > a')
		.then(function() {
			assert.equal($('#search .results table.customers tbody tr').length, 1, 'has 1 customer');
			assert.equal($('#search .results table.customers tfoot td').length, 0, 'no "load more"');
		});
});

test('search "%" returns 4 transactions. Click load more shows 2 more and hides load more', function(assert) {
	Testing.setupSearch(4);

	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');
		})
		.click('#search .results table.transactions tfoot td.load-more-results a')
		.then(function() {
			assert.equal($('#search .results table.transactions tbody tr').length, 4, 'has 4 transactions');
			assert.equal($('#search .results table.transactions tfoot td').length, 0, 'does not have "load more"');
		});
});

// can't create a hold at the moment
/*
test('search "%" click filter by holds.', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .results th.type a.dropdown-toggle')
		.then(function() {
			assert.equal($('#search .results li.transactions ul.transaction-filter').css('display'), 'block', 'transaction filter menu visible');
		})
		.click('#search .results li.transactions ul.transaction-filter a:contains("Holds")')
		.then(function() {
			assert.equal($('#search .results li.transactions > a:contains("1")').length, 1, 'has 1 hold transactions in header');
			assert.equal($('#search .results table.transactions tbody tr').length, 1, 'has 1 hold transactions');
		});
});
*/

test('search click result', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .results .customers a:first')
		.click('#search .results table.items tbody tr a:first')
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Customer', 'transition to customer page');
			assert.equal($('#search .results:visible').length, 0, 'search result should be hidden');
		});
});

test('search date picker dropdown', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 0, 'Date Picker not visible');
			Testing.runSearch('%');
		})
		.click('#search .datetime-picker')
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
			assert.equal($('.daterangepicker:visible .calendar').length, 2, 'Date Picker has 2 calendars visible');
			$('.daterangepicker:visible input[name="daterangepicker_start"]').val('8/1/2013').trigger('change');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			assert.equal($('.daterangepicker:visible').length, 0, 'Date Picker not visible');
		});
});

test('search date range pick', function(assert) {
	var spy;
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .datetime-picker')
		.then(function() {
			var dp = $("#search .datetime-picker").data("daterangepicker");
			dp.setStartDate("Aug 01, 2013");
			dp.setEndDate("Aug 02, 2013");
			spy = sinon.spy(Balanced.Adapter, 'get');
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var begin = moment("Aug 01, 2013").startOf('day');
			var begin_iso = encodeURIComponent(begin.toISOString());
			var end = moment("Aug 02, 2013").startOf('day');
			var end_iso = encodeURIComponent(end.toISOString());

			var expected_uri = '/marketplaces/' + Testing.MARKETPLACE_ID + '/search?' +
				'created_at%5B%3C%5D=' + end_iso + '&' +
				'created_at%5B%3E%5D=' + begin_iso + '&' +
				'limit=2&offset=0&q=&sort=created_at%2Cdesc&type%5Bin%5D=debit%2Ccredit%2Ccard_hold%2Crefund';

			var request = spy.getCall(spy.callCount - 1);
			assert.equal(request.args[0], Balanced.Transaction);
			assert.equal(request.args[1], expected_uri);
		});
});

test('search date sort has three states', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');

		var objectPath = "#search .results th.date";
		var states = [];
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
		};

		var count = 0;
		var testAmount = 5;
		while (count !== testAmount) {
			$(objectPath).click();
			getState();
			count++;
		}
		states.sort();

		var expectedStates = ["ascending", "descending"];
		assert.equal(states[0], expectedStates[0]);
		assert.equal(states[1], expectedStates[1]);
		assert.equal(states.length, 2);
	});
});
