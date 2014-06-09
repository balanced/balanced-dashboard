module("Balanced.CardDebitTransactionFactory");

test("#getDestinationAttributes", function(assert) {
	var subject = Balanced.CardDebitTransactionFactory.create({
		name: "King K. Rool",
		number: "4111 1111 1111 1111",
		cvv: "900",
		expiration_month: "3",
		expiration_year: "2014",
		postal_code: "98102"
	});

	assert.deepEqual(subject.getDestinationAttributes(), {
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

test("#getDebitAttributes", function(assert) {
	var subject = Balanced.CardDebitTransactionFactory.create({
		dollar_amount: "1.54",
		appears_on_statement_as: "Pirate Crocodile",
	});
	assert.deepEqual(subject.getDebitAttributes(), {
		amount: "154",
		appears_on_statement_as: "Pirate Crocodile",
		description: undefined
	});
});
