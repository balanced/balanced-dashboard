module("Balanced.BankAccount");

test("#isRemoved", function(assert) {
	var test = function(expectation, attributes) {
		var bankAccount = Balanced.BankAccount.create(attributes);
		assert.deepEqual(bankAccount.get("isRemoved"), expectation);
	};

	test(true, {
		can_credit: false
	});

	test(false, {
		can_credit: true
	});
});

test("#isVerified", function(assert) {
	var test = function(expectation, attributes) {
		var bankAccount = Balanced.BankAccount.create(attributes);
		assert.deepEqual(bankAccount.get("isVerified"), expectation);
	};

	test(false, {
		can_debit: false
	});

	test(true, {
		can_debit: true
	});
});

test("#verificationStatus", function(assert) {
	var test = function(expectation, attributes) {
		var bankAccount = Balanced.BankAccount.create(attributes);
		assert.equal(bankAccount.get("status"), expectation);
	};

	test("removed", {
		isRemoved: true,
		isVerified: true,
		customer: true
	});

	test("verified", {
		isRemoved: false,
		isVerified: true,
		customer: true
	});

	test("pending", {
		isRemoved: false,
		isVerified: false,
		customer: true,
		can_confirm_verification: true
	});

	test("unverified", {
		isRemoved: false,
		isVerified: false,
		customer: true,
		can_confirm_verification: false
	});

	test("unverifiable", {
		isRemoved: false,
		isVerified: false,
		customer: undefined,
	});
});
