module("ImportPayments", {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {}
});

test("Read and process CSV data", function(assert) {
	stop();
	var expectations = [
		null, {
			"customer.email": "harry.tan@example.com",
			"bankAccount.name": "Harry Tan",
			"credit.appears_on_statement_as": "Payment #9746",
			"credit.amount": 1600
		},
		null,
		null,
		null, {
			"customer.email": "dwyane.braggart@example.org",
			"bankAccount.name": "Dwyane Braggart",
			"credit.appears_on_statement_as": "Payment #7050",
			"credit.amount": 5400
		}, {
			"customer.email": "charlie.chan@example.org",
			"bankAccount.name": "Charlie Chan",
			"credit.appears_on_statement_as": "Payment #4818",
			"credit.amount": 3200
		},
		null, {
			"customer.email": "harrison.ford@example.org",
			"bankAccount.name": "Harrison Ford",
			"bankAccount.routing_number": "121000358",
			"credit.appears_on_statement_as": "Payment #2720",
			"credit.amount": 4300
		}
	];

	var successfulEntries = expectations.filter(function(expectation) {
		return expectation !== null;
	});

	var csvString = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
		",,,,,Dwyane Braggart,CHECKING,15,Payment #1771,[INVALID] No Acct. No",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,16,Payment #9746,[VALID]",
		",Harry Tan,harry.tan@example.org,121000358,123123123,Harry Tan,CHECKING,-19,Payment #7891,[INVALID] Negative Amount",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,nuce,Payment #5425,[INVALID] Non numeric amount",
		",Tommy Tang,tommy.tang@example.org,121000000,123123123,Tommy Tang,SAVINGS,1,Payment #5119,[INVALID] Invalid routing no",
		",Dwyane Braggart,dwyane.braggart@example.org,121000358,123123123,Dwyane Braggart,SAVINGS,54,Payment #7050,[VALID]",
		",Charlie Chan,charlie.chan@example.org,121000358,123123123,Charlie Chan,CHECKING,32,Payment #4818,[VALID]",
		",,,121000358,123123123,John Foo,SAVINGS,17,Payment #4805,[INVALID] No customer.",
		",Harrison Ford,harrison.ford@example.org,121000358,123123000,Harrison Ford,CHECKING,43,Payment #2720,[VALID]"
	].join("\n");

	var collection = Balanced.CreditCreatorsCollection.fromCsvText(csvString);
	var content = collection.get("content");

	assert.equal(content.length, 9);
	assert.deepEqual(content.get("0.csvFields"), {
		bank_account_id: "",
		new_customer_name: "",
		new_customer_email: "",
		new_bank_account_routing_number: "",
		new_bank_account_number: "",
		new_bank_account_holders_name: "Dwyane Braggart",
		new_bank_account_type: "CHECKING",
		amount: "15",
		appears_on_statement_as: "Payment #1771",
		description: "[INVALID] No Acct. No"
	});

	content.forEach(function(creator) {
		Ember.run(function() {
			creator.get("credit");
		});
	});

	// Wait for credits, customers and banks to be loaded.
	Ember.run(function() {
		collection.save(function(results) {
			expectations.forEach(function(expectation, i) {
				if (expectation === null || results[i] === null) {
					assert.deepEqual(results[i], expectation);
				} else {
					_.each(expectation, function(val, key) {
						assert.deepEqual(results[i].get(key), val);
					});
				}
			});

			var credits = Balanced.currentMarketplace.get("credits.content");
			_.each(successfulEntries, function(expectation, index) {
				var credit = credits[3 - index];
				var customer = Balanced.Customer.find(credit.get("customer_uri"));
				var bankAccount = Balanced.BankAccount.find(credit.get("destination_uri"));
				assert.deepEqual(customer.get("email"), expectation["customer.email"]);
				assert.deepEqual(bankAccount.get("name"), expectation["bankAccount.name"]);
				assert.deepEqual(credit.get("amount"), expectation["credit.amount"]);
				assert.deepEqual(credit.get("appears_on_statement_as"), expectation["credit.appears_on_statement_as"]);
			});
			start();
		});
	});
});
