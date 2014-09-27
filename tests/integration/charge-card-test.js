import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Charge Card', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");

		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			balanced.card.create,
			Adapter.create
		);
		Ember.run(App, "destroy");
	}
});

test('form validation', 2, function() {
	visit(Testing.MARKETPLACE_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.checkElements({
			"#charge-card button:contains(Debit)": 1
		})
		.click('button:contains(Debit)')
		.then(function() {
			ok($('.control-group.error').length > 0, 'errors are displayed');
		});
});

test('can charge a card', 3, function() {
	var spy = sinon.spy(Adapter, 'create');
	var tokenizingStub = sinon.stub(balanced.card, 'create');
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			cvv: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			dollar_amount: '12.00'
		})
		.click('button:contains(Debit)')
		.then(function() {
			ok(tokenizingStub.calledOnce);
			ok(spy.calledOnce);
			ok(spy.calledWith(Models.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})));
			tokenizingStub.restore();
		});
});

test('charge a card button is hidden after submit', 4, function() {
	var spy = sinon.spy(Adapter, 'create');
	var tokenizingStub = sinon.stub(balanced.card, 'create');
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	visit(Testing.MARKETPLACES_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			cvv: '123',
			expiration_month: '12',
			expiration_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			dollar_amount: '12.00'
		})
		.click("#charge-card .modal-footer .btn:last")
		.then(function() {
			equal($("#charge-card .modal-footer .btn:last").length, 0, "Button not present");
		})
		.then(function() {
			ok(spy.calledOnce, "Called once");
			ok(spy.calledWith(Models.Debit, '/cards/' + Testing.CARD_ID + '/debits', sinon.match({
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			})), "Called with right arguments");
		});
});

test('when charge a card triggers an error, the error is displayed to the user', function() {
	visit(Testing.MARKETPLACES_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry'
		}, {
			click: '.modal-footer button:contains(Debit)'
		})
		.then(function() {
			equal($('.alert-error').is(':visible'), true);
		});
});
