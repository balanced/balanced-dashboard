import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Marketplace Settings Webhooks', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();

		Ember.run(function() {
			Models.Callback.create({
				uri: '/callbacks',
				url: 'http://api.com/something',
				revision: '1.0'
			}).save();
		});

		sinon.stub(Ember.Logger, "error");
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			Adapter['delete'],
			Adapter.update,
			Ember.Logger.error
		);
		Ember.run(App, 'destroy');
	}
});


test('shows webhooks', function() {
	visit(Testing.SETTINGS_ROUTE)
		.checkElements({
			".webhooks tbody tr": 1
		});
});

test('can add webhooks', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name=url]", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name=callback-revision]", '1.0')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			equal(stub.getCall(0).args[2].revision, '1.0');
			equal(stub.getCall(0).args[2].url, 'http://www.example.com/something');
		});
});

test('can manage webhooks', function() {
	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name=url]", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name=callback-revision]", '1.1')
		.click('#add-callback .modal-footer button[name=modal-submit]')
		.check(".webhooks tbody td.no-results", 0)
		.click('.webhooks tbody tr:first a.delete-callback-link')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.check(".webhooks tbody td.no-results", 1);
});

test('delete webhooks only submits once even if clicked multiple times', function() {
	var spy = sinon.stub(Adapter, "delete");

	visit(Testing.SETTINGS_ROUTE)
		.click(".webhook-info .add")
		.fillIn("#add-callback .modal-body input[name=url]", 'http://www.example.com/something')
		.fillIn("#add-callback .modal-body select[name=callback-revision]", '1.1')
		.click('#add-callback .modal-footer button[name=modal-submit]')

		.click('.webhooks tbody tr:first a.delete-callback-link')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.click('#delete-callback .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
		});
});
