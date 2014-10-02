import TransactionFactory from "balanced-dashboard/models/factories/transaction-factory";

module("Factory - TransactionFactory");

test("#isAmountPositive", function() {
	var test = function(amount, expectation) {
		var subject = TransactionFactory.create({
			dollar_amount: amount
		});
		deepEqual(subject.isAmountPositive(), expectation);
	};

	test("1000", true);
	test("10.00", true);

	test("-10.00", false);
	test("", false);
	test("-1.000", false);
	test(0, false);
	test(null, false);
});

test("#amount", function() {
	var test = function(amount, expectation) {
		var subject = TransactionFactory.create();
		subject.set("dollar_amount", amount);
		deepEqual(subject.get("amount"), expectation);
	};

	test("10.00", "1000");
	test("vbruvkrjbvr", undefined);
	test(100, "10000");
});
