module("Balanced.CreditCreatorCsvObjectMapper");

test("#deserialize('string')", function(assert) {
	var values = {
		"   cat   ": "cat",
	    "dog  ": "dog",
		"    iguana": "iguana",
		" mountain lion ": "mountain lion"
	};

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();
	_.each(values, function(expectation, value) {
		assert.equal(subject.deserialize("string", value), expectation);
	});
});

test("#deserialize('lowerCaseString')", function(assert) {
	var values = {
		"   GIRAFFE   ": "giraffe",
	    "   ": undefined,
		"    iguana": "iguana",
		"Mountain Lion": "mountain lion"
	};

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();
	_.each(values, function(expectation, value) {
		assert.equal(subject.deserialize('lowerCaseString', value), expectation);
	});
});

test("#deserialize('number')", function(assert) {
	var values = {
		"   -1   ": -1,
		"10000": 10000,
		"vrjknvr": undefined,
	    "0  ": 0,
	    "0931.90": 931.9
	};

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();
	_.each(values, function(expectation, value) {
		assert.equal(subject.deserialize('number', value), expectation);
	});
});

test("#extractBankAccountAttributes", function(assert) {
	var values = [{
		bank_account_id: "3092370",
		new_bank_account_routing_number: "125000000",
		new_bank_account_number: "999999",
		new_bank_account_holders_name: "Robert Duck",
		new_bank_account_type: "CREDIT"
	}, {
		bank_account_id: "3092370",
		new_bank_account_routing_number: "     ",
		new_bank_account_number: "",
		new_bank_account_holders_name: "",
		new_bank_account_type: "CREDIT"
	}];

	var expectations = [{
		account_number: "999999",
		id: "3092370",
		name: "Robert Duck",
		routing_number: "125000000",
		type: "credit"
	}, {
		account_number: undefined,
		id: "3092370",
		name: undefined,
		routing_number: undefined,
		type: "credit"
	}];

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();

	_.each(values, function (value, index) {
		var results = subject.extractBankAccountAttributes(value);
		assert.deepEqual(results, expectations[index]);
	});
});

test("#extractCustomerAttributes", function(assert) {
	var values = [{
		new_customer_name: "Alfred Aardvark",
		new_customer_email: "alfred@aardvark.com",
		some_other_value: "vkrjbvkrb"
	}, {
		new_customer_name: "         ",
		new_customer_email: "       "
	}];

	var expectations = [{
		name: "Alfred Aardvark",
		email: "alfred@aardvark.com"
	}, {
		name: undefined,
		email: undefined
	}];

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();

	_.each(values, function (value, index) {
		var results = subject.extractCustomerAttributes(value);
		assert.deepEqual(results, expectations[index]);
	});
});

test("#extractCreditAttributes", function(assert) {
	var values = [{
		amount_in_cents: "  -1000",
		description: "Important Credit",
		appears_on_statement_as: "ZOO# Entrance"
	}, {
		amount_in_cents: "vrlohvkr",
		description: "Super Description",
		appears_on_statement_as: "ZOO# Entrance"
	}];

	var expectations = [{
		amount: -1000,
		description: "Important Credit",
		appears_on_statement_as: "ZOO# Entrance"
	}, {
		amount: undefined,
		description: "Super Description",
		appears_on_statement_as: "ZOO# Entrance"
	}];

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();

	_.each(values, function (value, index) {
		var results = subject.extractCreditAttributes(value);
		assert.deepEqual(results, expectations[index]);
	});
});

test("#convertCreditCsvRowToObject", function(assert) {
	var values = [{
		bank_account_id: "3092370",
		new_bank_account_routing_number: "125000000",
		new_bank_account_number: "999999",
		new_bank_account_holders_name: "Robert Duck",
		new_bank_account_type: "CREDIT",

		new_customer_name: "Alfred Aardvark",
		new_customer_email: "alfred@aardvark.com",
		some_other_value: "vkrjbvkrb",

		amount_in_cents: "  -1000",
		description: "Important Credit",
		appears_on_statement_as: "ZOO# Entrance"
	}];
	var expectations = [{
		bank_account: {
			account_number: "999999",
			id: "3092370",
			name: "Robert Duck",
			routing_number: "125000000",
			type: "credit"
		},
		customer: {
			name: "Alfred Aardvark",
			email: "alfred@aardvark.com"
		},
		credit: {
			amount: -1000,
			description: "Important Credit",
			appears_on_statement_as: "ZOO# Entrance"
		}
	}];

	var subject = Balanced.CreditCreatorCsvObjectMapper.create();
	_.each(values, function (value, index) {
		var results = subject.convertCreditCsvRowToObject(value);
		assert.deepEqual(results, expectations[index]);
	});
});
