module("Balanced.CsvPaymentRow");

test("isValid", function(assert) {

	var subject = Balanced.CsvPaymentRow.create({
		baseObject: {
			"credit.amount": "10.00",
		}
	});
	assert.ok(subject.get("isValid"));
	subject.set("baseObject", {});
	assert.ok(!subject.get("isValid"));
	subject.set("baseObject", {
		"credit.amount": -100
	});
	assert.ok(!subject.get("isValid"));
});

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
