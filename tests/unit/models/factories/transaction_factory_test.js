module("Balanced.TransactionFactory");

test("#isAmountPositive", function(assert) {
	var test = function(amount, expectation) {
		var subject = Balanced.TransactionFactory.create({
			dollar_amount: amount
		});
		assert.deepEqual(subject.isAmountPositive(), expectation);
	};

	test("1000", true);
	test("10.00", true);

	test("-10.00", false);
	test("", false);
	test("-1.000", false);
	test(0, false);
	test(null, false);
});

test("#amount", function(assert) {
	var test = function(amount, expectation) {
		var subject = Balanced.TransactionFactory.create();
		subject.set("dollar_amount", amount);
		assert.deepEqual(subject.get("amount"), expectation);
	};

	test("10.00", "1000");
	test("vbruvkrjbvr", undefined);
	test(100, "10000");
});
