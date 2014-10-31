import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Credits', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");

		Testing.setupMarketplace();
		Testing.createCredit();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.update,
			Adapter.create
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.CREDIT_ROUTE)
		.checkPageType("Credit")
		.checkPageTitle("$100.00");
});

test('can reverse credit', function() {
	var spy = sinon.spy(Adapter, "create");
	var reverseSelector = ".page-navigation a:contains(Reverse)";

	visit(Testing.CREDIT_ROUTE)
		.click(reverseSelector)
		.fillIn('#reverse-credit .modal-body input[name=dollar_amount]', "10")
		.click('#reverse-credit .modal-footer button[name=modal-submit]')
		.then(function() {
			var firstCall = spy.firstCall;
			ok(spy.calledOnce);
			deepEqual(firstCall.args[0], Models.Reversal);
			deepEqual(firstCall.args[2].amount, "1000");
		})
		.checkElements({
			"#reverse-credit:visible": 0
		});

	visit(Testing.CREDIT_ROUTE)
		.click(reverseSelector)
		.fillIn('#reverse-credit .modal-body input[name=dollar_amount]', 90)
		.click('#reverse-credit .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledTwice);
			ok(spy.calledWith(Models.Reversal));
			equal(spy.getCall(1).args[2].amount, "9000");
		})
		.checkElements({
			"#reverse-credit:visible": 0
		});

	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			equal($(reverseSelector).length, 0, 'No reverse credit buttons');
		});
});

test('credit reversal errors', function() {
	$.each(['-10000', '0'], function(e, amount) {
		visit(Testing.CREDIT_ROUTE)
			.click('.page-navigation a:contains(Reverse)')
			.fillIn('#reverse-credit .modal-body input[name=dollar_amount]', amount)
			.click('#reverse-credit .modal-footer button[name=modal-submit]')
			.checkElements({
				"#reverse-credit .form-group.has-error": 1
			})
			.click("#reverse-credit .close");
	});
});

test('reversing a credit with a comma in the amount will succeed', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CREDIT_ROUTE)
		.click('.page-navigation a:contains(Reverse)')
		.fillForm('#reverse-credit', {
			dollar_amount: "1,0",
			description: "Cool Reversal"
		})
		.click('#reverse-credit .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			var firstCall = spy.getCall(0);
			deepEqual(firstCall.args.slice(0, 2), [Models.Reversal, "/credits/" + Testing.CREDIT_ID + "/reversals"]);
			matchesProperties(firstCall.args[2], {
				amount: "1000",
				description: "Cool Reversal",
				credit_uri: "/credits/" + Testing.CREDIT_ID
			});
		});
});

test('renders metadata correctly', function() {
	var spy = sinon.spy(Adapter, "update");

	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			Ember.run(function() {
				var controller = BalancedApp.__container__.lookup("controller:credits");
				controller.get("model").set("meta", metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		});
});

test('displays failure reason amount in dollars', function() {
	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:credits').get('model');
			Ember.run(function() {
				model.set('amount', '50036');
				model.set('status', 'failed');
				model.set('failure_reason', 'Marketplace MP77RU803dGnrYYws7ySAkDA has insufficient funds to cover a transfer of 42500. There is currently a required reserve of 50036.');
			});
		})
		.checkElements({
			".status p": "Marketplace MP77RU803dGnrYYws7ySAkDA has insufficient funds to cover a transfer of $425.00. There is currently a required reserve of $500.36."
		});
});

test('displays failure reason amount in dollars', function(assert) {
	visit(Testing.CREDIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:credits').get('model');
			Ember.run(function() {
				model.set('amount', '50036');
				model.set('status', 'failed');
				model.set('failure_reason', 'Marketplace MP77RU803dGnrYYws7ySAkDA has insufficient funds to cover a transfer of 42500. There is currently a required reserve of 50036.');
			});
		}).checkElements({
			".status p": "Marketplace MP77RU803dGnrYYws7ySAkDA has insufficient funds to cover a transfer of $425.00. There is currently a required reserve of $500.36."
		}, assert);
});
