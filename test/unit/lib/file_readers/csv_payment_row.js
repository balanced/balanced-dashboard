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

test("isSubmittable", function(assert) {
	var subject = Balanced.CsvPaymentRow.create({
		baseObject: {
			"credit.amount": "-10.00",
		}
	});

	assert.ok(!subject.get('isSubmittable'));
	subject.set("credit.amount", 10);

	assert.ok(subject.get('isSubmittable'));
	subject.get("credit").set("isNew", false);
	assert.ok(!subject.get('isSubmittable'));
});

test("deserialize", function(assert) {
	var subject = Balanced.CsvPaymentRow.create();
	var values = [10, undefined, "crkjbvr", "-10"];
	var expectations = [1000, undefined, undefined, undefined];

	values.forEach(function(val, i) {
		assert.deepEqual(subject.deserialize("credit.amount", val), expectations[i]);
	});

	assert.deepEqual(subject.deserialize("cool.beans", 10), 10);
});

test("getDeepValue", function(assert) {
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"bank_account.id": "cool id",
			"credit.id": "10",
			"credit.amount": "10.00",
			"credit.client.name": "Dr. Giraffe"
		}
	});

	var expectations = {
		"bank_account.id": "cool id",
		"credit.id": "10",
		"credit.amount": 1000,
		"credit.client.name": "Dr. Giraffe"
	};

	_.each(expectations, function(val, key) {
		assert.deepEqual(row.getDeepValue(key), val);
	});

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
