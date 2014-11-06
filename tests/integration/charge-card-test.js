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
	visit(Testing.ACTIVITY_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.checkElements({
			"#charge-card button:contains(Debit)": 1
		})
		.click('button:contains(Debit)')
		.check("#charge-card .form-group.has-error", 5);
});

test('can charge a card', function() {
	var spy = sinon.spy(Adapter, 'create');
	var tokenizingStub = sinon.stub(balanced.card, 'create');
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	visit(Testing.ACTIVITY_ROUTE)
		.click('.page-navigation a:contains(Debit a card)')
		.fillForm('#charge-card', {
			name: 'Tarun Chaudhry',
			number: '4111111111111111',
			cvv: '123',
			expiration_date_month: '12',
			expiration_date_year: '2016',
			postal_code: '95014',
			appears_on_statement_as: 'My Charge',
			description: 'Internal',
			dollar_amount: '12.00'
		})
		.click('button:contains(Debit)')
		.check("#charge-card", 0)
		.then(function() {
			var args = spy.firstCall.args;
			ok(tokenizingStub.calledOnce);
			ok(spy.calledOnce);
			deepEqual(args.slice(0, 2), [Models.Debit, "/cards/%@/debits".fmt(Testing.CARD_ID)]);
			matchesProperties(args[2], {
				amount: "1200",
				appears_on_statement_as: 'My Charge',
				description: 'Internal',
				source_uri: '/cards/' + Testing.CARD_ID
			});
		});
});
