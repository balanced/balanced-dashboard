module("Balanced.NewCustomerCreditCreator");

var generateTestSubject = function() {
	var row = {
		new_customer_name: "Harry Tan",
		new_customer_email: "harry.tan@example.com",
		new_bank_account_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry S. Tan",
		new_bank_account_type: "Checking",
		amount: "100",
		appears_on_statement_as: "Payment #9746",
		description: "5 Gold Rings"
	};

	return Balanced.NewCustomerCreditCreator.create({
		csvFields: row
	});
};

test("#isExisting", function(assert) {
	var cc = Balanced.NewCustomerCreditCreator.create();
	assert.ok(!cc.get("isExisting"));
});

test("#bankAccount", function(assert) {
	var cc = generateTestSubject();

	var bankAccount = cc.get("bankAccount");
	var expectations = {
		routing_number: "121000358",
		account_number: "123123123",
		name: "Harry S. Tan",
		type: "Checking"
	};

	_.each(expectations, function(value, key) {
		assert.deepEqual(bankAccount.get(key), value);
	});
});

test("#customer", function(assert) {
	var cc = generateTestSubject();
	var customer = cc.get("customer");

	var expectations = {
		name: "Harry Tan",
		email: "harry.tan@example.com"
	};

	_.each(expectations, function(value, key) {
		assert.deepEqual(customer.get(key), value);
	});
});

test("#credit", function(assert) {
	var cc = generateTestSubject();

	assert.deepEqual(cc.get("credit.amount"), 10000);
	assert.deepEqual(cc.get("customer"), undefined);
	assert.deepEqual(cc.get("credit.uri"), "/credits/uri");
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
