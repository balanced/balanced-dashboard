import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Logs (non-deterministic)', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

var setLogsProperties = function() {
	Ember.run(function() {
		var controller = BalancedApp.__container__.lookup('controller:marketplaceLogs');
		controller.get("model").setProperties({
			limit: 2,
			startTime: null,
			endTime: null
		});
	});
};

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
