import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Holds', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();

		andThen(function() {
			Testing._createCard()
				.then(function(card) {
					return Models.Hold.create({
						uri: card.get('card_holds_uri'),
						appears_on_statement_as: 'Pixie Dust',
						amount: 10000,
						description: 'Cocaine'
					}).save();
				})
				.then(function(hold) {
					Testing.HOLD_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/holds/' + hold.get('id');
					Testing.HOLD_URI = hold.get("uri");
				});
		});
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
	visit(Testing.HOLD_ROUTE)
		.checkPageType("Hold")
		.checkPageTitle("$100.00");
});

test('can void hold', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.HOLD_ROUTE)
		.click(".void-hold-button")
		.click('#void-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			ok(spy.calledOnce);
			deepEqual(spy.firstCall.args[0], Models.Hold);
			deepEqual(spy.firstCall.args[1], Testing.HOLD_URI);
			ok(spy.getCall(0).args[2].is_void);
		});
});

test('can capture hold', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.HOLD_ROUTE)
		.click(".capture-hold-button")
		.fillForm("#capture-hold", {
			dollar_amount: "10",
			description: "Test debit"
		})
		.click('#capture-hold .modal-footer button[name="modal-submit"]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce, "Create capture called once");
			equal(args[0], Models.lookupFactory("debit"));
			matchesProperties(args[2], {
				amount: 1000,
				description: "Test debit",
				hold_uri: Testing.HOLD_URI
			});
		});
});
