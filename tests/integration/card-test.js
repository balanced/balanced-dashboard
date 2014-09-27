import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Card Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, "destroy");
	}
});

test('can view card page', function() {
	visit(Testing.CARD_ROUTE)
		.checkPageType("Credit card")
		.checkPageTitle("1111 Visa");
});

test('debit card', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Debit)")
		.checkElements({
			'label.control-label:contains(characters max):visible': "Appears on statement as (18 characters max)",
		})
		.then(function() {
			equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'18'
			);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			ok(spy.calledWith(Models.Debit, "/cards/" + Testing.CARD_ID + "/debits", sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function() {
	var spy = sinon.stub(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Debit)")
		.fillForm("#debit-funding-instrument", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.clickMultiple('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
		});
});

test('hold card', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Hold)")
		.then(function() {
			ok($('#hold-card').is(':visible'), 'Hold Card Modal Visible');
		})
		.fillForm("#hold-card", {
			dollar_amount: "1000",
			description: "Test Hold"
		})
		.click("#hold-card .modal-footer button[name=modal-submit]")
		.then(function() {
			var expectedAttributes = {
				amount: 100000,
				description: "Test Hold",
				source_uri: "/cards/" + Testing.CARD_ID
			};

			var args = spy.firstCall.args;
			ok(spy.calledOnce, "Adapter.create called");
			equal(args[0], Models.Hold);
			equal(args[1], "/cards/" + Testing.CARD_ID + "/card_holds");
			_.each(expectedAttributes, function(value, key) {
				equal(args[2][key], value);
			});
		});
});

test('holding only submits once despite multiple clicks', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup('controller:cards');
			var model = controller.get('model');
			Ember.run(function() {
				model.set('customer', true);
			});
		})
		.click(".page-actions a:contains(Hold)")
		.fillForm("#hold-card", {
			dollar_amount: "1000",
			description: "Test debit"
		})
		.clickMultiple('#hold-card .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
		});
});

test('renders metadata correctly', function() {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.CARD_ROUTE)
		.then(function() {
			var controller = BalancedApp.__container__.lookup("controller:cards");
			Ember.run(function() {
				controller.get("model").set("meta", metaData);
			});
		})
		.checkElements({
			".dl-horizontal dt:contains(key)": 1,
			".dl-horizontal dd:contains(value)": 1,

			".dl-horizontal dt:contains(other-keey)": 1,
			".dl-horizontal dd:contains(other-vaalue)": 1,
		});
});
