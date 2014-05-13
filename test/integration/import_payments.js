module("ImportPayments", {
	setup: function() {
		Testing.setupMarketplace();
		Testing.createDebits();
	},
	teardown: function() {}
});

var matchProperties = function(object, properties) {
	var result = {};
	properties.forEach(function(propName) {
		result[propName] = object.get(propName);
	});
	return result
};

var assertProperties = function(assert, object, expectedProperties, message) {
	var actualProperties = matchProperties(object, _.keys(expectedProperties));
	assert.deepEqual(actualProperties, expectedProperties, message);
};

asyncTest("Read and process CSV data", function(assert) {
	var expectations = [{
		customer: {
			name: "Harry Tan",
			email: "harry.tan@example.com"
		},
		bankAccount: {
			name: "Harry Tan",
			routing_number: "121000358",
			account_number: "123123123",
			type: "checking"
		},
		credit: {
			appears_on_statement_as: "Payment #9746",
			amount: 1600,
			description: "[VALID]"
		}
	}, {
		customer: {
			name: "Harry Tan",
			email: "harry.tan@example.org"
		},
		bankAccount: {
			name: "Harry Tan",
			routing_number: "121000358",
			account_number: "123123123",
			type: "checking"
		},
		credit: {
			appears_on_statement_as: "Payment #7891",
			amount: -1900,
			description: "[INVALID] Negative Amount"
		}
	}, {
		customer: {
			name: "Harry Tan",
			email: "harry.tan@example.com"
		},
		bankAccount: {
			name: "Harry Tan",
			routing_number: "121000358",
			account_number: "123123123",
			type: "checking"
		},
		credit: {
			appears_on_statement_as: "Payment #5425",
			amount: undefined,
			description: "[INVALID] Non numeric amount"
		}
	}, {
		customer: {
			name: "Dwyane Braggart",
			email: 'dwyane.braggart@example.org'
		},
		bankAccount: {
			name: "Dwyane Braggart",
			routing_number: "121000358",
			account_number: "123123123",
			type: "savings"
		},
		credit: {
			appears_on_statement_as: "Payment #7050",
			amount: 5400,
			description: '[VALID]'
		}
	}];

	var successfulEntries = expectations.filter(function(expectation) {
		return expectation !== null;
	});

	var mp = Balanced.currentMarketplace;

	var csvString = [
		"new_customer_name,new_customer_email,new_bank_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
		"Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,16,Payment #9746,[VALID]",
		"Harry Tan,harry.tan@example.org,121000358,123123123,Harry Tan,CHECKING,-19,Payment #7891,[INVALID] Negative Amount",
		"Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKING,nuce,Payment #5425,[INVALID] Non numeric amount",
		"Dwyane Braggart,dwyane.braggart@example.org,121000358,123123123,Dwyane Braggart,SAVINGS,54,Payment #7050,[VALID]"
	].join("\n");

	var collection = Balanced.CreditCreatorsCollection.fromCsvText(mp, csvString);

	expectations.forEach(function(objects, index) {
		var obj = collection.objectAt(index)
		_.each(objects, function(expectedProperties, keyName) {
			assertProperties(assert, obj.get(keyName), expectedProperties, "Properties of object %@.%@ ".fmt(index, keyName));
		});
	});

	assert.equal(collection.get("length"), 4, "Is correct length");
	assert.deepEqual(collection.objectAt(0).get("csvFields"), {
		new_customer_name: "Harry Tan",
		new_customer_email: "harry.tan@example.com",
		new_bank_routing_number: "121000358",
		new_bank_account_number: "123123123",
		new_bank_account_holders_name: "Harry Tan",
		new_bank_account_type: "CHECKING",
		amount: "16",
		appears_on_statement_as: "Payment #9746",
		description: "[VALID]"
	}, "CSV fields are correct");

	collection.save(function(results) {
		var credits = Balanced.currentMarketplace.get("credits");
		assertProperties(assert, credits.objectAt(1), expectations[0].credit, "Saved credit 0");
		assertProperties(assert, credits.objectAt(0), expectations[3].credit, "Saved credit 1");
		start();
	});
});
