import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Bank Account Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.createBankAccount();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
		Ember.run(App, 'destroy');
	}
});

var setBankAccountProperties = function(properties) {
	Ember.run(function() {
		App.__container__.lookup('controller:bankAccounts')
			.get('model').setProperties(properties);
	});
};

test('can view bank account page', function() {
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.checkPageType("Checking account")
		.checkPageTitle("1234 Wells Fargo Bank");
});

test('credit bank account', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.checkText('#credit-funding-instrument label:contains(characters max)', 'Appears on statement as (14 characters max)')
		.then(function() {
			var attribute = $('#credit-funding-instrument input[name=appears_on_statement_as]').prop("maxLength");
			equal(attribute, 14);
		})
		.fillForm("#credit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test credit',
			appears_on_statement_as: "Test credit"
		})
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			deepEqual(stub.firstCall.args[0], Models.lookupFactory("credit"));
			deepEqual(stub.firstCall.args[1], '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits');
			matchesProperties(stub.firstCall.args[2], {
				amount: 100000,
				description: "Test credit",
				appears_on_statement_as: "Test credit"
			});
		});
});

test('displays error message if properties are invalid', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.checkText('#credit-funding-instrument label:contains(characters max)', 'Appears on statement as (14 characters max)')
		.then(function() {
			var attribute = $('#credit-funding-instrument input[name=appears_on_statement_as]').prop("maxLength");
			equal(attribute, 14);
		})
		.fillForm("#credit-funding-instrument", {
			dollar_amount: 'abc',
			description: 'Test credit',
			appears_on_statement_as: "10/26 invalid statement"
		})
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.checkElements({
			".notification-center.error .message": 1,
			"#credit-funding-instrument .form-group.has-error": 2
		});
});

test('debit bank account', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".page-navigation a:contains(Debit)")
		.checkText('#debit-funding-instrument label:contains(characters max)', 'Appears on statement as (14 characters max)')
		.then(function() {
			var attr = $('#debit-funding-instrument input[name=appears_on_statement_as]').prop('maxLength');
			equal(attr, 14);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit',
			appears_on_statement_as: "Test debit"
		})
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			deepEqual(stub.firstCall.args[0], Models.lookupFactory("debit"));
			deepEqual(stub.firstCall.args[1], '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/debits');
			matchesProperties(stub.firstCall.args[2], {
				amount: 100000,
				description: "Test debit",
				appears_on_statement_as: "Test debit"
			});
		});
});

test('can initiate bank account verification', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				customer: true,
				verification: false
			});
		})
		.click(".status a:contains(Verify)")
		.check('#verify-bank-account', 1)
		.click('#verify-bank-account .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce, "Adapter#create called once");
			deepEqual(stub.args[0][0], App.__container__.lookupFactory("model:verification"));
			deepEqual(stub.args[0][1], '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/verifications');
		});
});

test('can confirm bank account verification', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: false,
				status: "pending",
				verification: Models.Verification.create({
					uri: '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications',
					verification_status: 'pending',
					attempts_remaining: 1
				})
			});
		})
		.click(".status a:contains(Verify)")
		.checkElements({
			"#confirm-verification:visible": 1
		})
		.fillForm("#confirm-verification", {
			amount_1: "1.00",
			amount_2: "1.00"
		})
		.click('#confirm-verification .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/bank_account_verifications'));
			ok(stub.getCall(0).args[2].amount_1, "1.00");
			ok(stub.getCall(0).args[2].amount_2, "1.00");
		});
});

test('renders customer', function() {
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			var controller = App.__container__.lookup("controller:bank_accounts");
			var customer = App.__container__.lookupFactory("model:customer")
								.find('/customers/' + Testing.CUSTOMER_ID);

			Ember.run(function() {
				controller.get("model").set("customer", customer);
			});
		})
		.checkElements({
			".linked-resources dt:contains(Customer)": 1,
			".linked-resources dd > a": 1,
		});
});

test('renders metadata correctly', function() {
	var metaData = {
		'key': 'value',
		'other-keey': 'other-vaalue'
	};
	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			var controller = App.__container__.lookup("controller:bank_accounts");
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
