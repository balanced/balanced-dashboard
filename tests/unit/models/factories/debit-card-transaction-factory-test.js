import DebitCardTransactionFactory from "balanced-dashboard/models/factories/debit-card-transaction-factory";

module("Factory - DebitCardTransactionFactory");

test("#getDestinationAttributes", function() {
	var subject = DebitCardTransactionFactory.create({
		name: "King K. Rool",
		number: "4111 1111 1111 1111",
		cvv: "900",
		expiration_month: "3",
		expiration_year: "2014",
		postal_code: "98102"
	});

	deepEqual(subject.getDestinationAttributes(), {
		name: "King K. Rool",
		number: "4111 1111 1111 1111",
		cvv: "900",
		expiration_month: "3",
		expiration_year: "2014",
		address: {
			postal_code: "98102"
		}
	});
});

test("#getDebitAttributes", function() {
	var subject = DebitCardTransactionFactory.create({
		dollar_amount: "1.54",
		appears_on_statement_as: "Pirate Crocodile",
	});
	deepEqual(subject.getDebitAttributes(), {
		amount: "154",
		appears_on_statement_as: "Pirate Crocodile",
		description: undefined
	});
});
