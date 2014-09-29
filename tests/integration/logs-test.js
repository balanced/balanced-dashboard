import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Logs', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.get
		);
		Ember.run(App, 'destroy');
	}
});

var setLogsProperties = function() {
	Ember.run(function() {
		var controller = BalancedApp.__container__.lookup('controller:marketplaceLogs');
		controller.get("resultsLoader").setProperties({
			limit: 2,
			startTime: null,
			endTime: null
		});
	});
};

test('can visit page', function() {
	var spy = sinon.spy(Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.then(function() {
			var logRequest = spy.getCall(spy.callCount - 1);
			var query = Models.Utils.queryStringToObject(logRequest.args[1]);
			equal(logRequest.args[0], Models.Log);
			deepEqual(query, {
				limit: "2",
				sort: "created_at,desc",
				"method[in]": "post,put,delete"
			});
		})
		.checkElements({
			'#content h1': "Logs"
		});
});

test('filter logs by datetime range', function() {
	var spy = sinon.spy(Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.click('#content .datetime-picker')
		.then(function() {
			equal($('.daterangepicker:visible').length, 1, 'Date Picker visible');
			$('.daterangepicker:visible input[name="daterangepicker_end"]').val('8/1/2013').trigger('change');
		})
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:marketplaceLogs');
			controller.get("resultsLoader").setProperties({
				startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
				endTime: moment('2013-08-01T23:59:59.999Z').toDate()
			});
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var request = spy.lastCall;
			equal(request.args[0], Models.Log);

			var query = Models.Utils.queryStringToObject(request.args[1]);
			deepEqual(query, {
				"created_at[<]": "2013-08-01T23:59:59.999Z",
				"created_at[>]": "2013-08-01T00:00:00.000Z",
				limit: "50",
				"method[in]": "post,put,delete",
				sort: "created_at,desc"
			});
		});
});


test('filter logs by request failed only', function() {
	var spy = sinon.spy(Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.click('.results .status-filter a:contains(Failed)')
		.then(function() {
			var query = Models.Utils.queryStringToObject(spy.lastCall.args[1]);
			equal(spy.lastCall.args[0], Models.Log);
			deepEqual(query, {
				limit: "2",
				sort: "created_at,desc",
				"method[in]": "post,put,delete",
				"status_rollup[in]": "3xx,4xx,5xx"
			});
		})
		.checkElements({
			'table.logs tbody tr': 1,
			'table.logs tfoot td': "",
			'table.logs tbody tr td': 'No results'
		});
});

test('filter logs by endpoint bank accounts', function() {
	var spy = sinon.spy(Adapter, 'get');

	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.then(function() {
			setLogsProperties();
		})
		.click('.results .endpoint-filter a:contains(Bank accounts)')
		.then(function() {
			var query = Models.Utils.queryStringToObject(spy.lastCall.args[1]);
			deepEqual(query, {
				endpoint: "bank_accounts",
				limit: "2",
				"method[in]": "post,put,delete",
				sort: "created_at,desc"
			});
		});
});

test('has logs in table', function() {
	visit(Testing.LOGS_ROUTE)
		.then(function() {
			setLogsProperties();
		})
		.click('#marketplace-nav i.icon-logs')
		.checkElements({
			'table.logs tbody tr': 2
		})
		.click('table.logs tfoot tr a')
		.checkElements({
			'table.logs tbody tr': 4,
			'table.logs tfoot td': 1
		});
});

test('view a particular log entry', function() {
	visit(Testing.LOGS_ROUTE)
		.click('#marketplace-nav i.icon-logs')
		.click('table.logs tbody tr:last-of-type a')
		.then(function() {
			equal($('h1.page-title').text(), 'POST /customers/' + Testing.CUSTOMER_ID + '/debits', 'h1 title is correct');
			equal($('dd[data-property="request-id"]').text().length, 35, 'Log request id valid');

			// Check request/response bodies
			ok($('.request-info .prettyprint').text().length > 3, 'Has Request Body');
			ok($('.response-info .prettyprint').text().length > 3, 'Has Response Body');
			ok($('.request-info .prettyprint').children().length > 3, 'Request Body Is Highlighted');
			ok($('.response-info .prettyprint').children().length > 3, 'Response Body Is Highlighted');
		});
});
