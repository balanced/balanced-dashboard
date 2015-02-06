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
		.click('.side-panel a .icon-edit:first')
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
				"country_code": undefined,
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
		.click('.side-panel a .icon-edit:first')
		.fillForm('#edit-customer-info', {
			name: 'TEST',
			email: 'TEST@example.com',
			business_name: 'TEST',
			ein: '1234',
			address_line1: '600 William St',
			address_line2: 'Apt 400',
			address_city: 'Oakland',
			address_state: 'CA',
			country_code: 'US',
			address_postal_code: '12345',
			phone: '1231231234',
			dob_month: '12',
			dob_year: '1924',
			ssn_last4: '1234'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			var args = stub.args[0];

			ok(stub.calledOnce);
			deepEqual(args[0], Models.Customer);
			matchesProperties(args[2], {
				name: "TEST",
				email: "TEST@example.com",
				business_name: "TEST",
				ein: "1234",
				phone: "1231231234",
				dob_month: 12,
				dob_year: 1924,
				ssn_last4: "1234"
			});

			matchesProperties(args[2].address, {
				line1: "600 William St",
				line2: "Apt 400",
				city: "Oakland",
				state: "CA",
				country_code: "US",
				postal_code: "12345"
			});
		});
});

test('can update customer info only some fields', function() {
	var stub = sinon.stub(Adapter, "update");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.side-panel a .icon-edit:first')
		.fillForm('#edit-customer-info', {
			business_name: '',
			ein: '',
			address_line1: '1 1st St',
			address_line2: '',
			address_city: '',
			address_state: '',
			country_code: '',
			address_postal_code: '',
			phone: '1231231234'
		})
		.click('#edit-customer-info .modal-footer button[name=modal-submit]')
		.click('#edit-customer-info .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			equal(stub.args[0][0], Models.Customer);
			deepEqual(stub.args[0][1], "/customers/" + Testing.CUSTOMER_ID);
			matchesProperties(stub.getCall(0).args[2], {
				name: "William Henry Cavendish III",
				email: "whc@example.org",
				business_name: "",
				ein: "",
				country_code: undefined,
				phone: "1231231234",
				dob_month: 2,
				dob_year: 1947,
				ssn_last4: "xxxx"
			});
			matchesProperties(stub.getCall(0).args[2].address, {
				line1: '1 1st St',
				line2: "",
				city: "",
				state: "",
				postal_code: ""
			});
		});
});

test('can debit customer using card', function() {
	Testing.createCard();

	var spy, fundingInstrumentUri;
	andThen(function() {
		spy = sinon.stub(Adapter, "create");
	});

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.checkElements({
			"#debit-customer form select[name=source] option": 2,
			"#debit-customer form select[name=source] option:eq(1)": "Credit card: 1111 Visa",
		})
		.then(function() {
			fundingInstrumentUri = $("#debit-customer form select[name=source] option:eq(1)").val();
			$("#debit-customer form select[name=source]").val(fundingInstrumentUri).change();
		})
		.fillForm("#debit-customer", {
			dollar_amount: "1000",
			description: "Card debit",
			appears_on_statement_as: "Cool"
		})
		.click('#debit-customer .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(spy.calledOnce, "Called once");
			var args = spy.firstCall.args;
			deepEqual(args.slice(0, 2), [Models.lookupFactory("debit"), "/cards/%@/debits".fmt(Testing.CARD_ID)]);
			matchesProperties(args[2], {
				amount: "100000",
				description: "Card debit",
				appears_on_statement_as: "Cool",
				source_uri: "/cards/%@".fmt(Testing.CARD_ID)
			});
		});
});

test('can debit customer using bank account', function() {
	Testing.createBankAccount();

	var spy, fundingInstrumentUri;
	andThen(function() {
		spy = sinon.stub(Adapter, "create");
	});

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Debit)")
		.checkElements({
			"#debit-customer form select[name=source] option": 2,
			"#debit-customer form select[name=source] option:eq(0)": "Checking account: 1234 Wells Fargo Bank",
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
			deepEqual(args.slice(0, 2), [Models.lookupFactory('debit'), "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID)]);
			matchesProperties(args[2], {
				amount: "100000",
				description: "Test debit",
				appears_on_statement_as: "Cool",
				source_uri: "/bank_accounts/%@".fmt(Testing.BANK_ACCOUNT_ID)
			});
		});
});

test("can't debit customer multiple times using the same modal", function() {
	Testing.createBankAccount();

	var spy, fundingInstrumentUri;
	andThen(function() {
		spy = sinon.stub(Adapter, "create");
	});

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
			ok(spy.calledOnce);
			deepEqual(spy.firstCall.args.slice(0, 2), [Models.lookupFactory('debit'), "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID)]);
			matchesProperties(spy.firstCall.args[2], {
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
