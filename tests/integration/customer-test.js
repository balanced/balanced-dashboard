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
		Testing.createBankAccount();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.update,
			Adapter.create,
			Adapter["delete"],
			balanced.bankAccount.create,
			balanced.card.create
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
			var firstCall = spy.firstCall;
			deepEqual(firstCall.args.slice(0, 3), [Models.Debit, "/cards/%@/debits".fmt(Testing.CARD_ID), {
				amount: "100000",
				description: "Card debit",
				appears_on_statement_as: "Cool",
				source_uri: "/cards/%@".fmt(Testing.CARD_ID)
			}]);
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
			var firstCall = spy.firstCall;
			deepEqual(firstCall.args.slice(0, 3), [Models.Debit, "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID), {
				amount: "100000",
				description: "Test debit",
				appears_on_statement_as: "Cool",
				source_uri: "/bank_accounts/%@".fmt(Testing.BANK_ACCOUNT_ID)
			}]);
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
			deepEqual(stub.firstCall.args.slice(0, 3), [Models.Debit, "/bank_accounts/%@/debits".fmt(Testing.BANK_ACCOUNT_ID), {
				amount: "100000",
				appears_on_statement_as: "Cool",
				description: "Test debit",
				source_uri: "/bank_accounts/%@".fmt(Testing.BANK_ACCOUNT_ID)
			}]);
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

module('Integration - Customer Page: Credit', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.setupMarketplace();
		Testing.createCreditCard();
		Testing.createDebitCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create
		);
	}
});

test('can credit to a debit card', function() {
	var spy = sinon.stub(Adapter, "create");
	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.checkElements({
			"#credit-customer form select[name=destination] option:contains(Checking account: 5555 Wells Fargo Bank Na)": 1,
			"#credit-customer form select[name=destination] option:contains(Debit card: 5556 Visa)": 1
		})
		.then(function() {
			var fundingInstrument = $("#credit-customer form select[name=destination] option:contains(Debit card: 5556 Visa)").val();
			$("#credit-customer form select[name=destination]").val(fundingInstrument).change();
		})
		.fillForm('#credit-customer', {
			dollar_amount: '1',
			appears_on_statement_as: "DEBIT",
			description: 'Test credit to a debit card'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.then(function() {
			var card = BalancedApp.__container__.lookup("controller:customer").get("model.creditable_cards").objectAt(0);
			ok(spy.calledOnce, "Create was called once");
			equal(spy.firstCall.args[0], Models.Credit);
			equal(spy.firstCall.args[1], card.get("uri") + '/credits');

			deepEqual(spy.firstCall.args[2].amount, '100');
			deepEqual(spy.firstCall.args[2].description, "Test credit to a debit card");
		});
});

test('when crediting customer triggers an error, the error is displayed to the user', function() {
	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.fillForm('#credit-customer', {
			dollar_amount: '10',
			description: 'Test credit'
		}, {
			click: '.modal-footer button[name=modal-submit]'
		})
		.checkElements({
			"#credit-customer .alert-error:contains(can't be blank)": 1
		});
});

test("can't credit customer multiple times using the same modal", function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click(".page-navigation a:contains(Credit)")
		.fillForm('#credit-customer', {
			dollar_amount: '1000',
			appears_on_statement_as: "SODA",
			description: 'Test credit'
		})
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.click('#credit-customer .modal-footer button[name=modal-submit]')
		.then(function() {
			deepEqual(stub.callCount, 1, "Create is created only once");
		});
});

module('Integration - Customer Page: Add', {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		Testing.setupMarketplace();
		Testing.setupMarketplace();
		Testing.createBankAccount();
		Testing.createCard();
	},
	teardown: function() {
		Testing.restoreMethods(
			Adapter.create,
			balanced.bankAccount.create,
			balanced.card.create
		);
	}
});

test('can add bank account', function() {
	var tokenizingSpy = sinon.stub(balanced.bankAccount, "create");

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a bank account)')
		.fillForm('#add-bank-account', {
			name: "TEST",
			account_number: "123",
			routing_number: "123123123",
			account_type: "savings"
		})
		.click('#add-bank-account .modal-footer button[name="modal-submit"]')
		.then(function() {
			var expectedArgs = {
				account_type: "savings",
				name: "TEST",
				account_number: "123",
				routing_number: "123123123"
			};
			var callArgs = tokenizingSpy.firstCall.args[0];
			ok(tokenizingSpy.calledOnce);

			_.each(expectedArgs, function(val, key) {
				equal(callArgs[key], val);
			});
		});
});

test('can add card', function() {
	var tokenizingStub = sinon.stub(balanced.card, "create");
	var stub = tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});

	var expectedArgs = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			"city": "Nowhere",
			"country_code": null,
			"line1": null,
			"line2": null,
			"postal_code": "90210",
			"state": null
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.fillForm('#add-card', {
			number: '1234123412341234',
			expiration_month: 1,
			expiration_year: 2020,
			cvv: '123',
			name: 'TEST'
		})
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expectedArgs, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('can add card with postal code', function() {
	var stub = sinon.stub(Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.card, "create");

	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});
	var input = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		postal_code: '94612'
	};
	var expected = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			"city": "Nowhere",
			"country_code": null,
			"line1": null,
			"line2": null,
			"postal_code": "94612",
			"state": null
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.fillForm('#add-card', input)
		.click('#add-card .modal-footer button[name="modal-submit"]')
		.then(function() {
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expected, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('can add card with address', function() {
	var stub = sinon.stub(Adapter, "create");
	var tokenizingStub = sinon.stub(balanced.card, "create");
	tokenizingStub.callsArgWith(1, {
		status: 201,
		cards: [{
			href: '/cards/' + Testing.CARD_ID
		}]
	});
	var input = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		postal_code: '94612',
		line1: '600 William St',
		line2: 'Apt 400',
		city: 'Oakland',
		state: 'CA',
		country_code: 'US'
	};
	var expected = {
		number: '1234123412341234',
		expiration_month: 1,
		expiration_year: 2020,
		cvv: '123',
		name: 'TEST',
		address: {
			postal_code: '94612',
			line1: '600 William St',
			line2: 'Apt 400',
			city: 'Oakland',
			state: 'CA',
			country_code: 'US'
		}
	};

	visit(Testing.CUSTOMER_ROUTE)
		.click('.main-panel a:contains(Add a card)')
		.click('#add-card a.more-info')
		.fillForm('#add-card', input, {
			click: '.modal-footer button[name="modal-submit"]'
		})
		.then(function() {

			// this tests balanced.js
			ok(tokenizingStub.calledOnce);
			ok(tokenizingStub.calledWith(sinon.match(expected)));
			var callArgs = tokenizingStub.firstCall.args;
			ok(tokenizingStub.calledOnce);
			_.each(expected, function(val, key) {
				deepEqual(callArgs[0][key], val);
			});
		});
});

test('verification renders properly against rev1', function() {
	visit(Testing.CUSTOMER_ROUTE)
		.checkElements({
			".status.verified": "Verified"
		});
});
