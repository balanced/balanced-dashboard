import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

var setCardProperties = function(properties) {
	var controller = BalancedApp.__container__.lookup('controller:cards');
	var model = controller.get('model');
	Ember.run(function() {
		model.setProperties(properties);
	});
};

module('Integration - Card Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, "destroy");
	}
});

test('can view card page', function() {
	visit(Testing.CARD_ROUTE)
		.checkPageType("Credit card")
		.checkPageTitle("1111 Visa");
});

test('debit card', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			setCardProperties({
				customer: true
			});
		})
		.click(".page-actions a:contains(Debit)")
		.check('#debit-funding-instrument label:contains(characters max)', "Appears on statement as (18 characters max)")
		.then(function() {
			var l = $('#debit-funding-instrument input[name=appears_on_statement_as]').prop('maxlength');
			equal(l, 18);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: "1000",
			description: "Test debit",
			appears_on_statement_as: "Test transaction"
		})
		.clickMultiple('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			deepEqual(spy.firstCall.args[0], Models.lookupFactory("debit"));
			deepEqual(spy.firstCall.args[1], "/cards/" + Testing.CARD_ID + "/debits");
			matchesProperties(spy.firstCall.args[2], {
				amount: 100000,
				description: "Test debit",
				appears_on_statement_as: "Test transaction"
			});
		});
});

test('hold card', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			setCardProperties({
				customer: true
			});
		})
		.click(".page-actions a:contains(Hold)")
		.check("#hold-card", 1)
		.fillForm("#hold-card", {
			dollar_amount: "1000",
			description: "Test Hold"
		})
		.clickMultiple("#hold-card .modal-footer button[name=modal-submit]")
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce, "Adapter.create called");
			deepEqual(args[0], Models.lookupFactory("hold"));
			deepEqual(args[1], "/cards/" + Testing.CARD_ID + "/card_holds");
			matchesProperties(args[2], {
				amount: 100000,
				description: "Test Hold",
				source_uri: "/cards/" + Testing.CARD_ID
			});
		});
});

test('renders metadata correctly', function() {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.CARD_ROUTE)
		.then(function() {
			setCardProperties({
				meta: metaData
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		});
});
