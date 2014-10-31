import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Refunds', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		andThen(function() {
			Testing._createCard().then(function(card) {
				return Models.Debit.create({
					uri: card.get('debits_uri'),
					amount: 100000
				}).save();
			}).then(function(debit) {
				return Models.Refund.create({
					uri: debit.get('refunds_uri'),
					debit_uri: debit.get('uri'),
					amount: 10000
				}).save();
			}).then(function(refund) {
				Testing.REFUND_ROUTE = '/marketplaces/' + Testing.MARKETPLACE_ID + '/refunds/' + refund.get('id');
			});
		});
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.update
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.REFUND_ROUTE)
		.checkPageType("Refund")
		.checkPageTitle("$100.00");
});

test('can edit refund', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.REFUND_ROUTE)
		.click('.linked-resources .edit-model-link')
		.fillIn('#edit-description .modal-body input[name=description]', "changing desc")
		.click('#edit-description .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			ok(spy.calledWith(Models.Refund));
			equal(spy.getCall(0).args[2].description, "changing desc");
		});
});

test('renders metadata correctly', function() {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.REFUND_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:refunds');
			Ember.run(function() {
				controller.set('model.meta', metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		});
});

test('can edit meta', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.REFUND_ROUTE)
		.click('.key-value-display:eq(1) .edit-model-link')
		.fillForm("#edit-meta", {
			key: "new key",
			value: "new value"
		})
		.click('#edit-meta .modal-footer button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce);
			equal(args[0], Models.Refund);
			deepEqual(args[2].meta, {
				"new key": "new value"
			});
		});
});
