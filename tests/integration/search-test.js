import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";
import Utils from "balanced-dashboard/lib/utils";

import Models from "../helpers/models";

var App, Adapter, Auth;

module('Integration - Search', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Auth = App.__container__.lookup("auth:main");
		Testing.setupMarketplace();

		andThen(function() {
			Ember.run(function() {
				App.__container__.lookup("controller:marketplace").setProperties({
					isShowSearchBar: true
				});
			});
		});
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

var assertQueryString = function(string, expected) {
	var qsParameters = Utils.queryStringToObject(string);
	_.each(expected, function(value, key) {
		deepEqual(qsParameters[key], value, "Query string parameter %@".fmt(key));
	});
};

var stubResults = function() {
	Ember.run(function() {
		var searchModal = BalancedApp.__container__.lookup("controller:modals-container").get("modalsContainer.childViews").objectAt(0);
		searchModal.set("hasResults", true);
	});
};

test('search results and no results', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('');
			stubResults();
		})
		.checkElements({
			"#search-modal .results": 1,
		})
		.then(function() {
			Testing.runSearch('');
		})
		.checkElements({
			"#search-modal .results .no-results": 0,
			"#search-modal .page-summary-with-icon": 1
		});

});

test('search date picker dropdown', function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			equal($('.daterangepicker:visible').length, 0, 'Date Picker not visible');
			Testing.runSearch('');
			stubResults();
		})
		.click('#search-modal .datetime-picker')
		.checkElements({
			'.daterangepicker:visible': 1,
			'.daterangepicker:visible .calendar': 2
		})
		.then(function() {
			$('.daterangepicker:visible input[name="daterangepicker_start"]').val('8/1/2013').trigger('change');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.checkElements({
			'.daterangepicker:visible': 1,
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.checkElements({
			'.daterangepicker:visible': 0,
		});
});

test('search date range pick', function() {
	var spy;
	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('%');
			stubResults();
		})
		.click('#search-modal .datetime-picker')
		.then(function() {
			var dp = $("#search-modal .datetime-picker").data("daterangepicker");
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

test('search date sort has two states', function() {
	var objectPath = "#search-modal .results th.date .sortable";

	visit(Testing.MARKETPLACE_ROUTE)
		.then(function() {
			Testing.runSearch('');
			stubResults();
		})
		.checkElements({
			"#search-modal .results th.date .sortable.descending": 1
		})
		.then(function() {
			$(objectPath).click();
		})
		.checkElements({
			"#search-modal .results th.date .sortable.ascending": 1
		});
});
