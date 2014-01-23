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
			assert.deepEqual(obj.customer, undefined);
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
			assert.deepEqual(obj.bankAccount, undefined);
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

test("Balanced.CsvObjectMapper.mapValue", function(assert) {
	var subject = Balanced.CsvObjectMapper.create();
	var values = [10, undefined, "crkjbvr", "-10"];
	var expectations = [10, undefined, undefined, undefined];

	values.forEach(function(val, i) {
		assert.deepEqual(subject.mapValue("credit.amount", val), expectations[i]);
	});

	assert.deepEqual(subject.mapValue("cool.beans", 10), 10);
});

test("Balanced.CsvObjectMapper.getDeepObject", function(assert) {
	var a = Balanced.CsvObjectMapper.create().getDeepObject({
		"bank_account.id": "cool id",
		"credit.id": "10",
		"credit.amount": "131",
		"credit.client.name": "Dr. Giraffe"
	});

	assert.deepEqual(a, {
		bank_account: {
			id: "cool id"
		},
		credit: {
			id: "10",
			amount: 131,
			client: {
				name: "Dr. Giraffe"
			}
		}
	});
});

test("Balanced.CsvObjectMapper.getDeepObject", function(assert) {
	var a = Balanced.CsvObjectMapper.create().getDeepObject({
		"account.id": "10",
		"credit.amount": "100",
		"credit.name": "Jim"
	});
	assert.deepEqual(a, {
		account: {
			id: "10"
		},
		credit: {
			amount: 100,
			name: "Jim"
		}
	});
});
