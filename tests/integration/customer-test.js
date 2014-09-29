import startApp from '../helpers/start-app';
import Testing from "../helpers/testing";

import checkElements from "../helpers/check-elements";
import createObjects from "../helpers/create-objects";
import helpers from "../helpers/helpers";

import Models from "../helpers/models";

var App, Adapter;

module('Integration - Customer Page', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			Adapter.get,
			Adapter.update
		);
		Ember.run(App, 'destroy');
	}
});

test('can view customer page', function() {
	visit(Testing.CUSTOMER_ROUTE)
		.checkPageType("Customer")
		.checkPageTitle("William Henry Cavendish III");
});

test('can edit customer info', function() {
	var spy = sinon.spy(Adapter, "update");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.side-panel a.icon-edit')
		.fillForm('#edit-customer-info', {
			name: "TEST"
		})
		.click('#edit-customer-info .modal-footer button[name=modal-submit]')
		.then(function() {
			var args = spy.firstCall.args;
			ok(spy.calledOnce);
			deepEqual(args.slice(0, 2), [
				Models.Customer,
				"/customers/%@".fmt(Testing.CUSTOMER_ID)
			]);
			deepEqual(args[2].name, "TEST");
			deepEqual(args[2].email, "whc@example.org");
			deepEqual(args[2].address, {
				"city": "Nowhere",
				"country_code": null,
				"line1": null,
				"line2": null,
				"postal_code": "90210",
				"state": null
			});
		});
});

test('can update customer info', function() {
	var stub = sinon.stub(Adapter, "update");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.side-panel a.icon-edit')
		.click('#edit-customer-info a.more-info')
		.fillForm('#edit-customer-info', {
			name: 'TEST',
			email: 'TEST@example.com',
			business_name: 'TEST',
			ein: '1234',
			line1: '600 William St',
			line2: 'Apt 400',
			city: 'Oakland',
			state: 'CA',
			country_code: 'US',
			postal_code: '12345',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1924',
			ssn_last4: '1234'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			var argsObject = {
				name: "TEST",
				email: "TEST@example.com",
				business_name: "TEST",
				ein: "1234",
				phone: "1231231234",
				dob_month: "12",
				dob_year: "1924",
				ssn_last4: "1234",
				address: {
					line1: "600 William St",
					line2: "Apt 400",
					city: "Oakland",
					state: "CA",
					country_code: "US",
					postal_code: "12345",
				},
			};

			ok(stub.calledOnce);
			ok(stub.args[0], Models.Customer);

			_.each(argsObject, function(val, key) {
				deepEqual(stub.getCall(0).args[2][key], val);
			});
		});
});

test('can update customer info only some fields', function() {
	var stub = sinon.stub(Adapter, "update");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.side-panel a.icon-edit')
		.click('#edit-customer-info a.more-info')
		.fillForm('#edit-customer-info', {
			business_name: '',
			ein: '',
			line1: '1 1st St',
			line2: '',
			city: '',
			state: '',
			country_code: '',
			postal_code: '',
			phone: '1231231234'
		})
		.click('#edit-customer-info .modal-footer button[name=modal-submit]')
		.click('#edit-customer-info .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.Customer));

			deepEqual(stub.getCall(0).args[2].name, "William Henry Cavendish III");
			deepEqual(stub.getCall(0).args[2].email, "whc@example.org");
			deepEqual(stub.getCall(0).args[2].business_name, null);
			deepEqual(stub.getCall(0).args[2].ein, null);
			deepEqual(stub.getCall(0).args[2].address.line1, '1 1st St');
			deepEqual(stub.getCall(0).args[2].address.line2, null);
			deepEqual(stub.getCall(0).args[2].address.city, null);
			deepEqual(stub.getCall(0).args[2].address.state, null);
			deepEqual(stub.getCall(0).args[2].address.country_code, null);
			deepEqual(stub.getCall(0).args[2].address.postal_code, null);
			deepEqual(stub.getCall(0).args[2].phone, "1231231234");
			deepEqual(stub.getCall(0).args[2].dob_month, 2);
			deepEqual(stub.getCall(0).args[2].dob_year, 1947);
			deepEqual(stub.getCall(0).args[2].ssn_last4, "xxxx");
		});
});

test('can debit customer using card', function() {
	Testing.createBankAccount();
	Testing.createCard();
	var spy = sinon.stub(Adapter, "create");
	var fundingInstrumentUri;

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.checkElements({
			"#debit-customer form select[name=source] option": 3,
			"#debit-customer form select[name=source] option:eq(0)": "Checking account: 1234 Wells Fargo Bank",
			"#debit-customer form select[name=source] option:eq(2)": "Credit card: 1111 Visa"
		})
		.then(function() {
			fundingInstrumentUri = $("#debit-customer form select[name=source] option:eq(2)").val();
			$("#debit-customer form select[name=source]").val(fundingInstrumentUri).change();
		})
		.fillForm("#debit-customer", {
			dollar_amount: "1000",
			description: "Card debit",
			appears_on_statement_as: "Cool"
		})
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce);
			var args = spy.firstCall.args;
			deepEqual(args.slice(0, 2), [Models.Debit, "/cards/%@/debits".fmt(Testing.CARD_ID)]);
			matchesProperties(args[2], {
				amount: "100000",
				description: "Card debit",
				appears_on_statement_as: "Cool",
				source_uri: "/cards/%@".fmt(Testing.CARD_ID)
			});
		});
});

test('can debit customer using bank account', function() {
	var spy = sinon.spy(Adapter, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.checkElements({
			"#debit-customer form select[name=source] option": 3,
			"#debit-customer form select[name=source] option:eq(0)": "Checking account: 1234 Wells Fargo Bank",
			"#debit-customer form select[name=source] option:eq(1)": "Checking account: 5555 Wells Fargo Bank Na"
		})
		.then(function() {
			var fundingInstrument = $("#debit-customer form select[name=source] option").eq(0).val();
			$("#debit-customer select[name=source]").val(fundingInstrument);
		})
		.fillForm('#debit-customer', {
			dollar_amount: '1000',
			description: 'Test debit',
			appears_on_statement_as: "Cool",
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			ok(spy.calledOnce);
			var args = spy.firstCall.args;
			deepEqual(args.slice(0, 2), [Models.Debit, "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID)]);
			matchesProperties(args[2], {
				amount: "100000",
				description: "Test debit",
				appears_on_statement_as: "Cool",
				source_uri: "/bank_accounts/%@".fmt(Testing.BANK_ACCOUNT_ID)
			});
		});
});

test("can't debit customer multiple times using the same modal", function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.then(function() {
			var fundingInstrument = $("#debit-customer form select[name=source] option").eq(0).val();
			$("#debit-customer select[name=source]").val(fundingInstrument);
		})
		.fillForm('#debit-customer', {
			dollar_amount: '1000',
			description: 'Test debit',
			appears_on_statement_as: "Cool",
		})
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			deepEqual(stub.firstCall.args.slice(0, 2), [Models.Debit, "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID)]);
			matchesProperties(stub.firstCall.args[2], {
				amount: "100000",
				appears_on_statement_as: "Cool",
				description: "Test debit",
				source_uri: "/bank_accounts/%@".fmt(Testing.BANK_ACCOUNT_ID)
			});
		});
});

test("debit customer triggers reload of transactions", function() {
	var spy = sinon.spy(Adapter, "get");

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.fillForm('#debit-customer', {
			dollar_amount: '1000',
			description: 'Test debit'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			ok(spy.calledWith(Models.Transaction));
		});
});
