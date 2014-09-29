import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Debits', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		andThen(function() {
			Testing._createCard().then(function(card) {
				return Models.Debit.create({
					uri: card.get('debits_uri'),
					appears_on_statement_as: 'Pixie Dust',
					amount: 100000,
					description: 'Cocaine'
				}).save();
			}).then(function(debit) {
				Testing.DEBIT_ID = debit.get('id');
				Testing.DEBIT_URI = debit.get('uri');
				Testing.DEBIT_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/debits/' + Testing.DEBIT_ID;
			});
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			Adapter.update
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.DEBIT_ROUTE)
		.checkPageType("Debit")
		.checkPageTitle("$1,000.00");
});

test('can refund debit', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.DEBIT_ROUTE)
		.click(".page-navigation a:contains(Refund)")
		.fillIn('#refund-debit .modal-body input[name="dollar_amount"]', "10")
		.click('#refund-debit .modal-footer button[name="modal-submit"]')
		.then(function() {
			ok(spy.calledOnce);
			ok(spy.calledWith(Models.Refund));
			equal(spy.getCall(0).args[2].debit_uri, Testing.DEBIT_URI);
			equal(spy.getCall(0).args[2].amount, '1000');
		});
});

test('failed debit shows failure information', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.setProperties({
					status: "failed",
					failure_reason: "Foobar"
				});
			});
		})
		.checkElements({
			'.summary .status p:contains(Foobar)': 1
		});
});

test('failed debit does not show refund modal', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.setProperties({
					status: "failed",
					failure_reason: "Foobar"
				});
			});
		})
		.checkElements({
			'#refund-debit:visible': 0
		});
});

test('fully refunded debit not show refund modal', function() {
	var spy = sinon.spy(Adapter, "update");
	var REFUNDED_DEBIT_ID, REFUNDED_DEBIT_ROUTE, REFUND_ROUTE;

	Ember.run(function() {
		Testing._createCard().then(function(card) {
			return Models.Debit.create({
				uri: card.get('debits_uri'),
				appears_on_statement_as: 'Pixie Dust',
				amount: 10000,
				description: 'Cocaine'
			}).save();
		}).then(function(debit) {
			REFUNDED_DEBIT_ID = debit.get('id');
			REFUNDED_DEBIT_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/debits/' + REFUNDED_DEBIT_ID;

			return Models.Refund.create({
				uri: debit.get('refunds_uri'),
				debit_uri: debit.get('uri'),
				amount: 10000
			}).save();
		}).then(function(refund) {
			REFUND_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/refunds/' + refund.get('id');
		});
	});

	visit(REFUNDED_DEBIT_ROUTE)
		.checkElements({
			'#refund-debit:visible': 0
		});
});

test('disputed debit does not show refund modal', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.setProperties({
					dispute: Models.Dispute.create()
				});
			});
		})
		.checkElements({
			'#refund-debit:visible': 0
		});
});

test('renders metadata correctly', function() {
	var spy = sinon.spy(Adapter, "update");

	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.DEBIT_ROUTE)
		.then(function() {
			var model = BalancedApp.__container__.lookup('controller:debits');
			Ember.run(function() {
				model.set('meta', metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		});
});
