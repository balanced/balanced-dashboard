import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Customer Page: Add', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			balanced.bankAccount.create,
			balanced.card.create
		);
		Ember.run(App, 'destroy');
	}
});

test('can add bank account', function() {
	var tokenizingSpy = sinon.stub(balanced.bankAccount, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a bank account)')
		.fillForm('#add-bank-account', {
			name: "TEST",
			account_number: "123",
			routing_number: "123123123",
			account_type: "savings"
		})
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			var expectedArgs = {
				account_type: "savings",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			};
			var callArgs = tokenizingSpy.firstCall.args[0];
			ok(tokenizingSpy.calledOnce);

			_.each(expectedArgs, function(val, key) {
				equal(callArgs[key], val);
			});
		});
});

test('can add card', function() {
	var tokenizingStub = sinon.stub(balanced.card, "create");
	var stub = tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	var expectedArgs = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			"city": "Nowhere",
			"country_code": null,
			"line1": null,
			"line2": null,
			"postal_code": "90210",
			"state": null
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.fillForm('#add-card', {
			number: '1234123412341234',
			expiration_month: 1,
			expiration_year: 2020,
			cvv: '123',
			name: 'TEST'
		})
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expectedArgs, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('can add card with postal code', function() {
	var stub = sinon.stub(Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.card, "create");

	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});
	var input = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		postal_code: '94612'
	};
	var expected = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			"city": "Nowhere",
			"country_code": null,
			"line1": null,
			"line2": null,
			"postal_code": "94612",
			"state": null
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.fillForm('#add-card', input)
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expected, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('can add card with address', function() {
	var stub = sinon.stub(Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.card, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});
	var input = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		postal_code: '94612',
		line1: '600 William St',
		line2: 'Apt 400',
		city: 'Oakland',
		state: 'CA',
		country_code: 'US'
	};
	var expected = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			postal_code: '94612',
			line1: '600 William St',
			line2: 'Apt 400',
			city: 'Oakland',
			state: 'CA',
			country_code: 'US'
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.click('#add-card a.more-info')
		.fillForm('#add-card', input, {
			click: '.modal-footer button[name="modal-submit"]'
		})
		.then(function() {

			// this tests balanced.js
			ok(tokenizingStub.calledOnce);
			ok(tokenizingStub.calledWith(sinon.match(expected)));
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expected, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('verification renders properly against rev1', function() {
	visit(Testing.CUSTOMER_ROUTE)
		.checkElements({
			".status.verified": "Verified"
		});
});
