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


var assertQueryString = function(string, expected, assert) {
	var qsParameters = Balanced.Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		assert.deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

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

test('search results hide when backdrop is clicked', function(assert) {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search.with-results": 1,
			"body.overlaid": 1
		}, assert)
		.click('#search .modal-backdrop')
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
			dp.setStartDate(moment('2013-08-01T00:00:00.000Z').toDate());
			dp.setEndDate(moment('2013-08-01T23:59:59.999Z').toDate());
			spy = sinon.spy(Balanced.Adapter, 'get');
		})
		.assertClick('.daterangepicker:visible .buttons button.applyBtn', assert)
		.then(function() {
			var request = spy.getCall(spy.callCount - 1);

			assert.equal(request.args[0], Balanced.Transaction);
			assert.deepEqual(request.args[1].split("?")[0], '/marketplaces/%@/search'.fmt(Testing.MARKETPLACE_ID));
			assertQueryString(request.args[1], {
				"created_at[<]": "2013-08-01T23:59:00.000Z",
				"created_at[>]": "2013-08-01T00:00:00.000Z",
				limit: "2",
				offset: "0",
				q: "",
				sort: "created_at,desc",
				"type[in]": "debit,credit,card_hold,refund,reversal"
			}, assert);
		});
});

test('search date sort has three states', function(assert) {
	var objectPath = "#search .results th.date .sortable";

	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			assert.ok($(objectPath).is(".descending"), "Search defaults to descending");
		})
		.click(objectPath)
		.then(function() {
			assert.ok($(objectPath).is(".ascending"), "Search is set to ascending");
		});
});
