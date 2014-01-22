module("Balanced.CsvPaymentRow", {
	setup: function() {
		Testing.setupMarketplace();
	},
	teardown: function() {}
});

test("deserialize", function(assert) {
	var subject = Balanced.CsvPaymentRow.create();
	var values = [10, undefined, "crkjbvr", "-10"];
	var expectations = [10, undefined, undefined, undefined];

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
		"credit.amount": 10,
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
			"credit.amount": "131",
			"credit.client.name": "Dr. Giraffe"
		}
	});

	assert.deepEqual(row.getDeepObject(), {
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

asyncTest("buildCustomer (empty)", 1, function (assert) {
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"customer.name": " "
		}
	});

	Ember.run(function() {
		row.buildCustomer()
			.then(function(obj) {
				assert.deepEqual(obj.customer, undefined);
				start();
			});
	});
});

asyncTest("buildCustomer (data)", 3, function(assert) {
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"customer.name": "Mr. Turtle",
			"customer.email": "mr.turtle@example.com"
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

asyncTest("buildBankAccount (invalid)", 1, function(assert){
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"bank_account.routing_number": "0000",
			"bank_account.number": "000011110"
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
			var row = Balanced.CsvPaymentRow.create({
				baseObject: {
					"bank_account.id": id,
					"bank_account.account_number": "000011110"
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
	var row = Balanced.CsvPaymentRow.create({
		baseObject: {
			"bank_account.id": "",
			"bank_account.routing_number": '121000358',
			"bank_account.number": '123123123',
			"bank_account.name": 'Existing bank account man'
		}
	});

	Ember.run(function() {
		row.buildBankAccount().then(function(obj) {
			var bankAccount = obj.bank;
			assert.ok(bankAccount);
			assert.ok(!bankAccount.get("id"));
			assert.equal(bankAccount.get("number"), "123123123");
			start();
		});
	});
});

test("setCreditCustomer", function(assert) {
	var row = Balanced.CsvPaymentRow.create();
	var customer = Balanced.Customer.create({
		name: "Miss Happy Lady"
	});
	var credit = Balanced.Credit.create();

	row.setCreditCustomer(credit, customer);

	assert.equal(credit.get("customer"), customer);
});

test("setCreditBankAccount", function(assert) {
	var row = Balanced.CsvPaymentRow.create();
	var bankAccount = Balanced.BankAccount.create({
		"number": "11110000"
	})
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
