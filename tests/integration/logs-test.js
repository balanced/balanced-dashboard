import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Utils from "balanced-dashboard/lib/utils";

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
		var controller = BalancedApp.__container__.lookup('controller:marketplace/logs');
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
			var query = Utils.queryStringToObject(logRequest.args[1]);
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
			var controller = BalancedApp.__container__.lookup('controller:marketplace/logs');
			Ember.run(function() {
				controller.get("resultsLoader").setProperties({
					startTime: moment('2013-08-01T00:00:00.000Z').toDate(),
					endTime: moment('2013-08-01T23:59:59.999Z').toDate()
				});
			});
		})
		.click('.daterangepicker:visible .buttons button.applyBtn')
		.then(function() {
			var request = spy.lastCall;
			equal(request.args[0], Models.Log);

			var query = Utils.queryStringToObject(request.args[1]);
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
			var query = Utils.queryStringToObject(spy.lastCall.args[1]);
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
			'table.logs tbody tr td': 'No logs'
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
			var query = Utils.queryStringToObject(spy.lastCall.args[1]);
			deepEqual(query, {
				endpoint: "bank_accounts",
				limit: "2",
				"method[in]": "post,put,delete",
				sort: "created_at,desc"
			});
		});
});
