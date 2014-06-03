module('Search', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
		Testing.createCustomer();
		Balanced.Auth.setProperties({
			signedIn: true,
			isGuest: false
		});
	}
});

test('search results show and hide', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('Cocaine');
		})
		.then(function() {
			assert.ok($('#search').hasClass('with-results'), 'search has no results');
			assert.ok($('body').hasClass('overlaid'), 'overlay not showing');
		})
		.then(function() {
			Testing.runSearch('');
		})
		.then(function() {
			assert.ok(!$('#search').hasClass('with-results'), 'blank search has results');
			assert.ok(!$('body').hasClass('overlaid'), 'overlay still showing');
		});
});

test('search results hide on click [x]', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search.with-results": 1,
			"body.overlaid": 1
		}, assert)
		.click('#search .search-close')
		.then(function() {
			assert.equal($('#q').val(), '', "Search query is reset");
		})
		.checkElements({
			"#search.with-results": 0,
			"body.overlaid": 0
		}, assert);
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
		.assertClick('#search .datetime-picker', assert)
		.then(function() {
			var dp = $("#search .datetime-picker").data("daterangepicker");
			dp.setStartDate("Aug 01, 2013");
			dp.setEndDate("Aug 02, 2013");
			spy = sinon.spy(Balanced.Adapter, 'get');
		})
		.assertClick('.daterangepicker:visible .buttons button.applyBtn', assert)
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
