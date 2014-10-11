import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Marketplace Settings Api Keys', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();

		sinon.stub(Ember.Logger, "error");
	},
	teardown: function() {
		Testing.restoreMethods(
			Models.ApiKey.prototype.save,
			Adapter.create,
			Adapter['delete'],
			Adapter.update,
			balanced.bankAccount.create,
			balanced.card.create,
			Ember.Logger.error
		);
		Ember.run(App, 'destroy');
	}
});

test('can add api key', function() {
	var stub = sinon.stub(Adapter, 'create');

	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('#api-key-create button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			equal(stub.firstCall.args[0], Models.lookupFactory("api-key"));
		})
		.click('.create-api-key-btn')
		.fillIn('#api-key-create [name=keyName]', 'Test1234')
		.click('#api-key-create button[name=modal-submit]')
		.then(function() {
			ok(stub.calledTwice);
			equal(stub.args[1][0], Models.lookupFactory("api-key"));
			matchesProperties(stub.args[1][2].meta, {
				name: 'Test1234'
			});
		});
});
