module("Balanced.CsvPaymentRow");

test("getDeepObject", function(assert) {
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"bank_account.id": "cool id",
			"credit.id": "10",
			"credit.amount": "10.00",
			"credit.client.name": "Dr. Giraffe"
		}
	});

	assert.deepEqual(row.getDeepObject(), {
		bank_account: {
			id: "cool id"
		},
		credit: {
			id: "10",
			amount: 1000,
			client: {
				name: "Dr. Giraffe"
			}
		}
	});
});
