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
		.click(".page-navigation a.credit-button")
		.checkText('label.control-label:contains(characters max):visible', 'Appears on statement as (14 characters max)')
		.then(function() {
			equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			// should be one create for the debit
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.Credit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/credits', sinon.match({
				amount: 100000,
				description: "Test credit"
			})));
		});
});

test('crediting only submits once despite multiple clicks', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.click(".page-navigation a.credit-button")
		.fillIn('#credit-funding-instrument .modal-body input[name="dollar_amount"]', '1000')
		.fillIn('#credit-funding-instrument .modal-body input[name="description"]', 'Test credit')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#credit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
		});
});

test('debit bank account', 4, function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".page-navigation a.debit-button")
		.then(function() {
			// opened the modal
			equal(
				$('label.control-label:contains(characters max):visible').text().trim(),
				'Appears on statement as (14 characters max)'
			);
			equal(
				$('input[name="appears_on_statement_as"]:visible').attr('maxlength'),
				'14'
			);
		})
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.Debit, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/debits', sinon.match({
				amount: 100000,
				description: "Test debit"
			})));
		});
});

test('debiting only submits once despite multiple clicks', function() {
	var stub = sinon.stub(Adapter, "create");

	visit(Testing.BANK_ACCOUNT_ROUTE)
		.then(function() {
			setBankAccountProperties({
				can_debit: true
			});
		})
		.click(".page-navigation a.debit-button")
		.fillForm("#debit-funding-instrument", {
			dollar_amount: '1000',
			description: 'Test debit'
		})
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.click('#debit-funding-instrument .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
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
		.then(function() {
			ok($('#verify-bank-account:visible'), 'verify bank account modal visible');
		})
		.click('#verify-bank-account .modal-footer button[name=modal-submit]')
		.then(function() {
			ok(stub.calledOnce);
			ok(stub.calledWith(Models.Verification, '/bank_accounts/' + Testing.BANK_ACCOUNT_ID + '/verifications'));
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
