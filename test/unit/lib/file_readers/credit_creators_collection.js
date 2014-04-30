module("Balanced.CreditCreatorsCollection", {});

test("#isExistingCustomers", function(assert) {
	var text = [
		"existing_customer_name_or_email,appears_on_statement_as,description,amount",
		"Cliff Lee,marketplacesite.co,Order #001231,63.28",
		"carlos.ruiz@example.com,marketplacesite.co,Order #001232,52.19",
	].join("\n");

	var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
	assert.ok(collection.get("isExistingCustomers"), "csv parsed as isExistingCustomers");
});

test(".fromCsvText", function(assert) {
	var text = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
		",,,,,Dwyane Braggart,invalid_account_type,15,Payment #1771,8 Ladies Dancing (Giggity)",
		",,,121000358,123123123,Dwyane Braggart,CHECKING,15,Payment #1771,8 Ladies Dancing (Giggity)",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,Checking,16,Payment #9746,5 Gold Rings",
		"3333,Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKG,16,Payment #9746,5 Gold Rings"
	].join("\n");
	var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
	assert.deepEqual(collection.get("length"), 4);

	var tests = {
		"content.0.isInvalid": true,
		"content.1.isInvalid": true,
		"content.2.isInvalid": false,
		"content.3.isInvalid": true
	};

	_.each(tests, function(value, attribute) {
		assert.deepEqual(collection.get(attribute), value);
	});
});

test("#valid", function(assert) {
	var collection = Balanced.CreditCreatorsCollection.create({
		content: []
	});
	collection.addObject(Ember.Object.create({
		isValid: true,
		amount: 10
	}));
	collection.addObject(Ember.Object.create({
		isValid: false,
		amount: 15
	}));
	collection.addObject(Ember.Object.create({
		isValid: true,
		amount: 23
	}));

	var expectations = {
		"valid.0.amount": 10,
		"valid.1.amount": 23,
		"valid.length": 2
	};

	_.each(expectations, function(expectedValue, key) {
		assert.equal(collection.get(key), expectedValue);
	});
});

test("#invalid", function(assert) {
	var collection = Balanced.CreditCreatorsCollection.create({
		content: []
	});
	collection.addObject(Ember.Object.create({
		isInvalid: false,
		amount: 10
	}));
	collection.addObject(Ember.Object.create({
		isInvalid: true,
		amount: 15
	}));
	collection.addObject(Ember.Object.create({
		isInvalid: true,
		amount: 23
	}));

	var expectations = {
		"invalid.0.amount": 15,
		"invalid.1.amount": 23,
		"invalid.length": 2
	};

	_.each(expectations, function(expectedValue, key) {
		assert.equal(collection.get(key), expectedValue);
	});
});

test("#isEmpty", function(assert) {
	var collection = Balanced.CreditCreatorsCollection.create({
		content: []
	});
	assert.ok(collection.get("isEmpty"));

	collection.set("content", [1]);
	assert.ok(!collection.get("isEmpty"));
});

test("#isInvalid", function(assert) {
	var collection = Balanced.CreditCreatorsCollection.create({
		invalid: [10, 39]
	});
	assert.ok(collection.get("isInvalid"));
	assert.ok(!collection.get("isValid"));

	collection.set("invalid", []);
	assert.ok(!collection.get("isInvalid"));
	assert.ok(collection.get("isValid"));
});

test("#toCsvString", function(assert) {
	var text = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
		",,,121000358,123123123,Dwyane Braggart,CHECKING,15,Payment #1771,8 Ladies Dancing (Giggity)",
	].join("\n");
	var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
	var result = collection.toCsvString();
	var expected = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description,errors",
		",,,121000358,123123123,Dwyane Braggart,CHECKING,15,Payment #1771,8 Ladies Dancing (Giggity),\"new_customer_name can't be blank\nnew_customer_email can't be blank\"",
	].join("\n");

	assert.deepEqual(result, expected);

});
