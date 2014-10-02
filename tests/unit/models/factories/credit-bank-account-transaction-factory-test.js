import CreditBankAccountTransactionFactory from "balanced-dashboard/models/factories/credit-bank-account-transaction-factory";

module("Factory - CreditBankAccountTransactionFactory");

test("#getDestinationAttributes", function() {
	var subject = CreditBankAccountTransactionFactory.create({
		account_number: "100000000",
		name: "Dr. Crock",
		routing_number: "1231234",
		account_type: null
	});

	deepEqual(subject.getDestinationAttributes(), {
		account_number: "100000000",
		name: "Dr. Crock",
		routing_number: "1231234",
		account_type: null
	});
});

test("#getAttributes", function() {
	var subject = CreditBankAccountTransactionFactory.create({
		dollar_amount: "5.67",
		appears_on_statement_as: "Important Comp",
		description: "xxxxx",
		account_number: "100000000",
	});

	deepEqual(subject.getAttributes(), {
		amount: "567",
		appears_on_statement_as: "Important Comp",
		description: "xxxxx",
		destination: {
			account_number: "100000000",
			account_type: undefined,
			routing_number: undefined,
			name: undefined
		}
	});
});
