module("UploadPaymentsCsv", {
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
			"bank_account.name": "Harry Tan",
			"credit.amount": 16
		},
		null,
		null,
		null, {
			"customer.email": "dwyane.braggart@example.org",
			"bank_account.name": "Dwyane Braggart",
			"credit.amount": 54
		}, {
			"customer.email": "charlie.chan@example.org",
			"bank_account.name": "Charlie Chan",
			"credit.amount": 32
		}, {
			"customer.email": undefined,
			"bank_account.name": "John Foo",
			"credit.amount": 17
		}, {
			"customer.email": "harrison.ford@example.org",
			"bank_account.name": "Harrison Ford",
			"credit.amount": 43
		}
	];

	var csvString = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount_in_cents,appears_on_statement_as,description",
		",,,,,Dwyane Braggart,CHECKING,15,Payment #1771,[INVALID] No Acct. No",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,16,Payment #9746,[VALID]",
		",Harry Tan,harry.tan@example.org,121000358,123123123,Harry Tan,CHECKING,-19,Payment #7891,[INVALID] Negative Amount",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,nuce,Payment #5425,[INVALID] Non numeric amount",
		",Tommy Tang,tommy.tang@example.org,121000000,123123123,Tommy Tang,SAVINGS,1,Payment #5119,[INVALID] Invalid routing no",
		",Dwyane Braggart,dwyane.braggart@example.org,121000358,123123123,Dwyane Braggart,SAVINGS,54,Payment #7050,[VALID]",
		",Charlie Chan,charlie.chan@example.org,121000358,123123123,Charlie Chan,CHECKING,32,Payment #4818,[VALID]",
		",,,121000358,123123123,John Foo,SAVINGS,17,Payment #4805,[VALID] No customer.",
		",Harrison Ford,harrison.ford@example.org,121000358,123123000,Harrison Ford,CHECKING,43,Payment #2720,[VALID]"
	].join("\n");

	var reader = Balanced.PaymentsCsvReader.create();
	reader.set("body", csvString);

	var rows = reader.getObjects();
	assert.equal(rows.length, 9);
	assert.deepEqual(rows[0], {
		bank_account_id: "",
		new_customer_name: "",
		new_customer_email: "",
		new_bank_account_routing_number: "",
		new_bank_account_number: "",
		new_bank_account_holders_name: "Dwyane Braggart",
		new_bank_account_type: "CHECKING",
		amount_in_cents: "15",
		appears_on_statement_as: "Payment #1771",
		description: "[INVALID] No Acct. No"
	});

	var creators = reader.getCreditCreators();
	creators.forEach(function(creator) {
		Ember.run(function() {
			creator.get("credit");
		});
	});

	// Wait for credits, customers and banks to be loaded.
	Ember.run(function() {
		reader.saveCreditCreators(creators, function(results) {
			expectations.forEach(function(expectation, i) {
				if (expectation === null || results[i] === null) {
					assert.deepEqual(results[i], expectation);
				} else {
					_.each(expectation, function(val, key) {
						assert.deepEqual(results[i].get(key), val);
					});
				}
			});
			start();
		});
	});
});
