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

test('can manage api keys', function() {
	visit(Testing.SETTINGS_ROUTE)
		.checkElements({
			'.api-keys-info tbody tr': 1
		})
		.click('.create-api-key-btn')
		.fillIn(".modal.create-api-key", {
			apiKeyName: "Cool Api Key"
		})
		.click('.modal.create-api-key button[name=modal-submit]')
		.checkElements({
			'.api-keys-info tbody tr': 2
		})
		.click('.confirm-delete-key:first')
		.checkElements({
			'.modal.delete-key:visible': 1
		})
		.click('.modal.delete-key:visible button[name=modal-submit]')
		.checkElements({
			'.api-keys-info tbody tr': 1
		});
});

test('can add api key', function() {
	var stub = sinon.stub(Adapter, 'create');
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.ApiKey));
		})
		.click('.create-api-key-btn')
		.fillIn('.modal.create-api-key input.full', 'Test1234')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			ok(stub.calledTwice);
			ok(stub.getCall(1).calledWith(
				sinon.match.any,
				sinon.match.any,
				sinon.match.has('meta', {
					name: 'Test1234'
				})
			));
		});
});

test('adding api key updates auth', function() {
	var testSecret = 'amazing-secret';
	var saveStub = sinon.stub(Models.ApiKey.prototype, 'save');
	var stub = sinon.stub(Adapter, 'create');
	saveStub.returns({
		then: function(callback) {
			callback(Ember.Object.create({
				secret: testSecret
			}));
		}
	});

	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(
				Models.UserMarketplace,
				sinon.match.any,
				sinon.match.has('secret', testSecret)
			));
		});
});

test('cannot delete current api key without a replacement', function() {
	visit(Testing.SETTINGS_ROUTE)
		.checkElements({
			".confirm-delete-key": 0
		})
		.then(function() {
			equal($('.confirm-delete-key').length, 0);
		})
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.checkElements({
			".confirm-delete-key": 2
		});
});

test('can delete api key', function() {
	var stub = sinon.stub(Adapter, 'delete');
	visit(Testing.SETTINGS_ROUTE)
		.click('.create-api-key-btn')
		.click('.modal.create-api-key button[name=modal-submit]')
		.click('.confirm-delete-key:first')
		.click('.modal.delete-key button[name=modal-submit]:visible')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.APIKey));
		});
});
