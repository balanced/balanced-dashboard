module("Balanced.CreditCreator");

test(".fromCsvRow", function(assert) {
	var mp = {
		search: sinon.stub().returns({
			addObserver: sinon.stub()
		})
	};
	var row = Balanced.CreditCreator.fromCsvRow(mp, {
		existing_customer_name_or_email: "dr.plant@example.com"
	});
	assert.equal(row.constructor, Balanced.ExistingCustomerCreditCreator);

	row = Balanced.CreditCreator.fromCsvRow(mp, {
		new_customer_name: "Doctor Plant"
	});
	assert.equal(row.constructor, Balanced.NewCustomerCreditCreator);
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
		var creator = Balanced.ExistingCustomerCreditCreator.create({
			csvFields: {
				amount: value
			}
		});
		creator.validate();
		var messages = creator.get("validationErrors.csvFields.amount.messages");
		assert.deepEqual(messages, expectedMessage);
	});
});

test("appears_on_statement_as validation", function(assert) {
	var tests = {
		"  1-BANANA 'doc'  ": undefined,
		"    ": ["can't be blank"],
		"109uoihnkjvh98vohnv5ohvnrk": ["must be under 15 characters"],
		" BALANCED, inc. ": ['"," is an invalid character'],
		" BAL,inc./corp. ": ['",/" are invalid characters']
	};

	_.each(tests, function(expectedMessage, value) {
		var creator = Balanced.ExistingCustomerCreditCreator.create({
			csvFields: {
				appears_on_statement_as: value
			}
		});
		creator.validate();
		var messages = creator.get("validationErrors.csvFields.appears_on_statement_as.messages");
		assert.deepEqual(messages, expectedMessage);
	});
});

test("#isInvalid", function(assert) {
	var creditCreator = Balanced.NewCustomerCreditCreator.create({
		csvFields: {
			new_customer_name: "",
			new_customer_email: "harry.tan@example.com",
			new_bank_account_routing_number: "121000358",
			new_bank_account_number: "123123123",
			new_bank_account_holders_name: "Harry Tan",
			new_bank_account_type: "Checking",
			amount: "100",
			appears_on_statement_as: "Payment #9746",
			description: "5 Gold Rings"
		}
	});
	creditCreator.validate();
	assert.ok(creditCreator.get("isInvalid"));

	creditCreator = Balanced.ExistingCustomerCreditCreator.create({
		csvFields: {
			existing_customer_name_or_email: "Cool",
			amount: "-100",
			appears_on_statement_as: "Payment #9746",
			description: "5 Gold Rings"
		}
	});
	creditCreator.validate();
	assert.ok(creditCreator.get("isInvalid"));

	creditCreator = Balanced.NewCustomerCreditCreator.create({
		csvFields: {
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
		}
	});
	creditCreator.validate();
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

test("#toLabeledCsvObject", function(assert) {
	var object = Object.create({
		new_customer_name: "",
		new_customer_email: "harry.tan@example.com",
		new_bank_account_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry Tan",
		new_bank_account_type: "Checking",
		amount: "100",
		appears_on_statement_as: "Payment #9746",
		description: "5 Gold Rings"
	});
	var expectation = {
		new_customer_name: "",
		new_customer_email: "harry.tan@example.com",
		new_bank_account_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry Tan",
		new_bank_account_type: "Checking",
		amount: "100",
		appears_on_statement_as: "Payment #9746",
		description: "5 Gold Rings",
		errors: "new_customer_name can't be blank"
	};

	var creditCreator = Balanced.NewCustomerCreditCreator.create({
		csvFields: object
	});
	creditCreator.validate();
	var result = creditCreator.toLabeledCsvRowObject();
	assert.deepEqual(result, expectation);
});
