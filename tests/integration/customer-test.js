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
			jQuery.ajax,
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

test('can update customer info', function() {
	var $spy = null;

	visit(Testing.CUSTOMER_ROUTE)
		.click('.side-panel a .icon-edit:first')
		.fillForm('#edit-customer-info', {
			name: 'Cool Test User',
			email: 'test+1111@example.com',
			business_name: 'Test Business',
			ein: '',
			phone: '987654321',
			dob_month: '12',
			dob_year: '1924',
			ssn_last4: '7744',
			address_line1: '123 Main St',
			address_line2: '#333',
			address_city: 'Metropolis',
			address_state: 'CA',
			country_code: 'US',
			address_postal_code: '12345',
		})
		.then(function() {
			$spy = sinon.spy(jQuery, "ajax");
		})
		.click('#edit-customer-info button[name=modal-submit]')
		.then(function() {
			deepEqual($spy.args[0][0], "https://api.balancedpayments.com/customers/" + Testing.CUSTOMER_ID);
			deepEqual(JSON.parse($spy.args[0][1].data), {
				name: "Cool Test User",
				email: "test+1111@example.com",
				business_name: "Test Business",
				ein: null,
				phone: '987654321',
				dob_month: 12,
				dob_year: 1924,
				ssn_last4: "7744",
				meta: {},
				address: {
					line1: "123 Main St",
					line2: "#333",
					city: "Metropolis",
					country_code: "US",
					postal_code: "12345",
					state: "CA"
				}
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
