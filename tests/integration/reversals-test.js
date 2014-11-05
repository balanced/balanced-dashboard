import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Reversals', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createReversal();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.update
		);
		Ember.run(App, 'destroy');
	}
});

test('can visit page', function() {
	visit(Testing.REVERSAL_ROUTE)
		.checkPageType("Reversal")
		.checkPageTitle("$100.00");
});

test('can edit reversal', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.REVERSAL_ROUTE)
		.click('.linked-resources .edit-model-link')
		.fillForm("#edit-description", {
			description: "changing desc"
		})
		.click('#edit-description .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			ok(spy.calledWith(Models.Reversal));
			equal(spy.getCall(0).args[2].description, "changing desc");
		});
});

test('renders metadata correctly', function() {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};

	visit(Testing.REVERSAL_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:reversals');
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
