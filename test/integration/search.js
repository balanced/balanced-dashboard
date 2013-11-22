module('Search', {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
		Balanced.Auth.set('signedIn', true);

		// add some delay, because the API takes some time to add things to search
		var stop = window.stop;
		stop();
		setTimeout(start, 1000);
	},
	teardown: function() {
		Ember.run(function() {
			$('#search span.close').click();
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
		.click('#search span.close')
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
			//assert.equal($('#search .results li.transactions > a:contains("4")').length, 1, 'has 4 transactions in header');
			assert.equal($('#search .results table.transactions tbody tr').length, 2, 'has 2 transactions');
			assert.equal($('#search .results table.transactions tfoot td').length, 1, 'has "load more"');
		});
});

test('search "%", click accounts, returns 1 accounts total, showing 1 account in results, with no load more', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .results li.accounts > a')
		.then(function() {
			//assert.equal($('#search .results li.accounts > a:contains("1")').length, 1, 'has 1 account in header');
			assert.equal($('#search .results table.accounts tbody tr').length, 1, 'has 1 account');
			assert.equal($('#search .results table.accounts tfoot td').length, 0, 'no "load more"');
		});
});

test('search "%" returns 4 transactions. Click load more shows 2 more and hides load more', function(assert) {
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
		.click('#search .results li.transactions a.dropdown-toggle')
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

test('search date picker dropdown', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');

		var toggle = $('#search .timing .dropdown-toggle');
		toggle.click();
		assert.ok(toggle.parent().hasClass('open'));

		var dp = toggle.parent().find('div.date-picker');
		dp.find('[name="after"]').click().focus();
		assert.ok(dp.find('.after').hasClass('selected'), 'after is selected');
		assert.ok(toggle.parent().hasClass('open'), 'date picker is still showing');
	});
});

test('search click result', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');
	})
		.then(function() {
			click('#search .results .accounts a');
			click($('#search .results table.items tbody tr a').first());
		})
		.then(function() {
			assert.equal($('#content h1').text().trim(), 'Customer', 'transition to customer page');
			assert.equal($('#search .results').css('display'), 'none', 'search result should be hidden');
		});
});

test('search and click go with empty date range', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');
	})
		.click('#search .results .timing a.dropdown-toggle')
		.click('#search .results button.go')
		.then(function() {
			assert.equal($('#search .results .timing a.dropdown-toggle span').text().trim(), 'Any time');
		});
});

test('search date range pick', function(assert) {
	var spy;
	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');
	})
		.click('#search .results .timing a.dropdown-toggle')
		.then(function() {
			$('#search .results .timing input[name="after"]').val('08/01/2013').trigger('keyup');
		})
		.click('#search .results .timing td.active.day')
		.then(function() {
			$('#search .results .timing input[name="before"]').val('08/01/2013').trigger('keyup');
		})
		.click('#search .results .timing td.active.day')
		.then(function() {
			spy = sinon.spy(Balanced.Adapter, 'get');
		})
		.click('#search .results button.go')
		.then(function() {
			// Notice: month 7 is Aug here for JS Date, ugly javascript...
			// As the date time is local, we need to convert it to ISO from in UTC timezone
			var begin = new Date(2013, 7, 1);
			var begin_iso = encodeURIComponent(begin.toISOString());
			var end = new Date(2013, 7, 2);
			var end_iso = encodeURIComponent(end.toISOString());

			var expected_uri = '/marketplaces/' + Testing.MARKETPLACE_ID + '/search?' +
				'created_at%5B%3C%5D=' + end_iso + '&' +
				'created_at%5B%3E%5D=' + begin_iso + '&' +
				'limit=2&offset=0&q=&type%5Bin%5D=debit%2Ccredit%2Ccard_hold%2Crefund';

			var request = spy.getCall(spy.callCount - 1);
			assert.ok(spy.calledOnce);
			assert.equal(request.args[0], Balanced.Transaction);
			assert.equal(request.args[1], expected_uri);
		});
});

test('search date preset pick', function(assert) {
	var spy;

	visit(Testing.MARKETPLACE_ROUTE).then(function() {
		Testing.runSearch('%');
	})
		.click('#search .results .set-times a:contains("Past hour")')
		.then(function() {
			spy = sinon.spy(Balanced.Adapter, 'get');
		})
		.click('#search .results button.go')
		.then(function() {
			assert.ok(spy.called);
			var request = spy.getCall(0);
			assert.equal(request.args[0], Balanced.Transaction);
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

		var expectedStates = ["ascending", "descending", "unsorted"];
		assert.equal(states[0], expectedStates[0]);
		assert.equal(states[1], expectedStates[1]);
		assert.equal(states[2], expectedStates[2]);
		assert.equal(states.length, 3);
	});
});
