module("Balanced.CreditCreator", {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {}
});

asyncTest("buildCustomer (empty)", 1, function(assert) {
	var row = Balanced.CreditCreator.build({
		customer: {
			name: "        "
		}
	});

	Ember.run(function() {
		row.buildCustomer().then(function(obj) {
			assert.deepEqual(obj.customer, null);
			start();
		});
	});
});

asyncTest("buildCustomer (data)", 3, function(assert) {
	var row = Balanced.CreditCreator.build({
		customer: {
			name: "Mr. Turtle",
			email: "mr.turtle@example.com"
		}
	});

	Ember.run(function() {
		row.buildCustomer()
			.then(function(obj) {
				assert.ok(obj.customer);
				assert.equal(obj.customer.get("name"), "Mr. Turtle");
				assert.equal(obj.customer.get("email"), "mr.turtle@example.com");
				start();
			});
	});
});

asyncTest("buildBankAccount (invalid)", 1, function(assert) {
	var row = Balanced.CreditCreator.build({
		bank_account: {
			routing_number: "0000",
			number: "000011110"
		}
	});

	Ember.run(function() {
		row.buildBankAccount().then(function(obj) {
			assert.deepEqual(obj.bankAccount, null);
			start();
		});
	});
});

asyncTest("buildBankAccount (existing)", 3, function(assert) {
	var dummyBank = Balanced.BankAccount.create();
	dummyBank.setProperties({
		routing_number: '121000358',
		account_number: '123123123',
		name: 'Existing bank account man'
	});

	Ember.run(function() {
		dummyBank.save().then(function(b) {
			var id = b.get("id");
			var row = Balanced.CreditCreator.build({
				bank_account: {
					id: id,
					account: "000011110"
				}
			});
			row.buildBankAccount().then(function(obj) {
				assert.equal(obj.bankAccount.get("id"), id);
				assert.equal(obj.bankAccount.get("routing_number"), "121000358");
				assert.equal(obj.bankAccount.get("account_number"), "xxxxx3123");
				start();
			});
		});
	});
});

asyncTest("buildBankAccount (new)", 3, function(assert) {
	var row = Balanced.CreditCreator.build({
		bank_account: {
			id: "",
			routing_number: '121000358',
			number: '123123123',
			name: 'Existing bank account man'
		}
	});

	Ember.run(function() {
		row.buildBankAccount().then(function(obj) {
			var bankAccount = obj.bankAccount;
			assert.ok(bankAccount);
			assert.ok(!bankAccount.get("id"));
			assert.equal(bankAccount.get("number"), "123123123");
			start();
		});
	});
});

test("setCreditCustomer", function(assert) {
	var row = Balanced.CreditCreator.create();
	var customer = Balanced.Customer.create({
		name: "Miss Happy Lady"
	});
	var credit = Balanced.Credit.create();

	row.setCreditCustomer(credit, customer);

	assert.equal(credit.get("customer"), customer);
});

test("setCreditBankAccount", function(assert) {
	var row = Balanced.CreditCreator.create();
	var bankAccount = Balanced.BankAccount.create({
		"number": "11110000"
	});
	var credit = Balanced.Credit.create();

	row.setCreditBankAccount(credit, bankAccount);

	assert.equal(credit.get("bank_account.number"), "11110000");
	assert.equal(credit.get("destination.number"), "11110000");

	bankAccount = Balanced.BankAccount.create({
		number: "00001111",
		credits_uri: "/092379386"
	});

	row.setCreditBankAccount(credit, bankAccount);
	assert.equal(credit.get("bank_account.number"), "00001111");
	assert.equal(credit.get("destination.number"), "00001111");
	assert.equal(credit.get("uri"), "/092379386");
});

test("amount validations", function(assert) {
	var tests = {
		"a lot  ": ["must be a positive number"],
		"0": ["must be a positive number"],
		"-10.00": ["must be a positive number"],
		"    ": ["can't be blank", "must be a positive number"],
		"10.00": undefined
	};

	_.each(tests, function(expectedMessage, value) {
		var creator = Balanced.CreditCreator.fromCsvRow({
			amount: value
		});
		var messages = creator.get("validationErrors.csvFields.amount.messages");
		assert.deepEqual(messages, expectedMessage);
	});
});

test("new_bank_account_type validations", function(assert) {
	var tests = {
		"   checking  ": undefined,
		"   savings  ": undefined,
		"   SAVINGS  ": undefined,
		"   cheCKING  ": undefined,
		"  pork ": ["pork is not a valid bank account type"],
		"    ": ["can't be blank"]
	};

	_.each(tests, function(expectedMessage, value) {
		var creator = Balanced.CreditCreator.fromCsvRow({
			new_bank_account_type: value
		});
		var messages = creator.get("validationErrors.csvFields.new_bank_account_type.messages");
		assert.deepEqual(messages, expectedMessage);
	});

	var creator = Balanced.CreditCreator.fromCsvRow({
		new_bank_account_type: "credit",
		bank_account_id: "309898264"
	});
	var messages = creator.get("validationErrors.csvFields.new_bank_account_type.messages");
	assert.deepEqual(messages, ["cannot specify a bank_account_id with this field"]);
});

test("new_customer_name validations", function(assert) {
	var tests = {
		"  Alfred Pangolin  ": undefined,
		"    ": ["can't be blank"]
	};

	_.each(tests, function(expectedMessage, value) {
		var creator = Balanced.CreditCreator.fromCsvRow({
			new_customer_name: value
		});
		var messages = creator.get("validationErrors.csvFields.new_customer_name.messages");
		assert.deepEqual(messages, expectedMessage);
	});

	var creator = Balanced.CreditCreator.fromCsvRow({
		new_customer_name: " Alfred Pangolin",
		bank_account_id: "309898264"
	});
	var messages = creator.get("validationErrors.csvFields.new_customer_name.messages");
	assert.deepEqual(messages, ["cannot specify a bank_account_id with this field"]);
});

test("#isExistingBankAccount", function(assert) {
	var row = Balanced.CreditCreator.fromCsvRow({
		bank_account_id: "  0937204yof4h4  "
	});
	assert.ok(row.isExistingBankAccount());
	row = Balanced.CreditCreator.fromCsvRow({
		bank_account_id: "   "
	});
	assert.ok(!row.isExistingBankAccount());
});

test("#isInvalid", function(assert) {
	var row = {
		bank_account_id: "3333333",
		new_customer_name: "Harry Tan",
		new_customer_email: "harry.tan@example.com",
		new_bank_account_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry Tan",
		new_bank_account_type: "Checking",
		amount: "100",
		appears_on_statement_as: "Payment #9746",
		description: "5 Gold Rings"
	};
	var creditCreator = Balanced.CreditCreator.fromCsvRow(row);
	assert.ok(creditCreator.get("isInvalid"));

	row = {
		bank_account_id: "    ",
		new_customer_name: "Harry Tan",
		new_customer_email: "harry.tan@example.com",
		new_bank_account_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry Tan",
		new_bank_account_type: "Checking",
		amount: "100",
		appears_on_statement_as: "Payment #9746",
		description: "5 Gold Rings"
	};
	creditCreator = Balanced.CreditCreator.fromCsvRow(row);
	assert.ok(!creditCreator.get("isInvalid"));
});

test("#isValid", function(assert) {
	var creditCreator = Balanced.CreditCreator.create({
		isInvalid: true
	});
	assert.ok(!creditCreator.get("isValid"));

	creditCreator.set("isInvalid", false);
	assert.ok(creditCreator.get("isValid"));
});

test("#isLoaded", function(assert) {
	var creditCreator = Balanced.CreditCreator.create({
		bankAccount: undefined,
		credit: undefined,
		customer: undefined,
	});
	assert.ok(!creditCreator.get("isLoaded"));
	creditCreator.set("bankAccount", null);
	assert.ok(!creditCreator.get("isLoaded"));
	creditCreator.set("credit", null);
	assert.ok(!creditCreator.get("isLoaded"));
	creditCreator.set("customer", null);
	assert.ok(creditCreator.get("isLoaded"));
});

test("#isSaveable", function(assert) {
	var creditCreator = Balanced.CreditCreator.create({
		credit: {
			isNew: false
		},
		isValid: false
	});

	assert.ok(!creditCreator.get("isSaveable"));
	creditCreator.set("isValid", true);
	assert.ok(!creditCreator.get("isSaveable"));
	creditCreator.set("credit.isNew", true);
	assert.ok(creditCreator.get("isSaveable"));
});
