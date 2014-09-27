import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Search', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Auth = App.__container__.lookup("auth:main");
		Testing.setupMarketplace();
		Testing.setupMarketplace();
		Testing.createDebits();
		Testing.createCustomer();
		Auth.setProperties({
			signedIn: true,
			isGuest: false
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});


var assertQueryString = function(string, expected) {
	var qsParameters = Models.Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

test('search results show and hide', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('Cocaine');
		})
		.checkElements({
			"#search.with-results": 1,
		})
		.then(function() {
			Testing.runSearch('');
		})
		.checkElements({
			"#search.with-results": 0,
		});
});

test('search results hide when backdrop is clicked', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.checkElements({
			"#search.with-results": 1,
		})
		.click('#search .modal-backdrop')
		.checkElements({
			"#search.with-results": 0,
		});
});

test('search date picker dropdown', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			equal($('.daterangepicker:visible').length, 0, 'Date Picker not visible');
			Testing.runSearch('%');
		})
		.click('#search .datetime-picker')
		.then(function() {
			equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
			equal($('.daterangepicker:visible .calendar').length, 2, 'Date Picker has 2 calendars visible');
			$('.daterangepicker:visible input[name="daterangepicker_start"]').val('8/1/2013').trigger('change');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.then(function() {
			equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			equal($('.daterangepicker:visible').length, 0, 'Date Picker not visible');
		});
});

test('search date range pick', function() {
	var spy;
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.click('#search .datetime-picker')
		.then(function() {
			var dp = $("#search .datetime-picker").data("daterangepicker");
			dp.setStartDate(moment('2013-08-01T00:00:00.000Z').toDate());
			dp.setEndDate(moment('2013-08-01T23:59:59.999Z').toDate());
			spy = sinon.spy(Adapter, 'get');
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var request = spy.getCall(spy.callCount - 1);

			equal(request.args[0], Models.Transaction);
			deepEqual(request.args[1].split("?")[0], '/marketplaces/%@/search'.fmt(Testing.MARKETPLACE_ID));
			assertQueryString(request.args[1], {
				"created_at[<]": "2013-08-01T23:59:00.000Z",
				"created_at[>]": "2013-08-01T00:00:00.000Z",
				sort: "created_at,desc",
				"type[in]": "credit,debit,card_hold,refund,reversal"
			});
		});
});

test('search date sort has three states', function() {
	var objectPath = "#search .results th.date .sortable";

	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
		})
		.then(function() {
			ok($(objectPath).is(".descending"), "Search defaults to descending");
		})
		.click(objectPath)
		.then(function() {
			ok($(objectPath).is(".ascending"), "Search is set to ascending");
		});
});
