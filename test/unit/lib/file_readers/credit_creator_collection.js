module("Balanced.CreditCreatorsCollection", {});

test(".fromCsvText", function(assert) {
	var text = [
		"bank_account_id,new_customer_name,new_customer_email,new_bank_account_routing_number,new_bank_account_number,new_bank_account_holders_name,new_bank_account_type,amount,appears_on_statement_as,description",
		",,,,,Dwyane Braggart,CHEcking,15,Payment #1771,8 Ladies Dancing (Giggity)",
		",,,121000358,123123123,Dwyane Braggart,CHECKING,15,Payment #1771,8 Ladies Dancing (Giggity)",
		",Harry Tan,harry.tan@example.com,121000358,123123123,Harry Tan,CHECKG,16,Payment #9746,5 Gold Rings"
	].join("\n");
	var collection = Balanced.CreditCreatorsCollection.fromCsvText(text);
	assert.equal(collection.get("length"), 3);
});

test("#valid", function(assert) {
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
		isInvalid: false,
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

test("#total", function(assert) {
	var collection = Balanced.CreditCreatorsCollection.create({
		content: []
	});
	collection.addObject(Ember.Object.create({
		isActive: true,
		amount: 10
	}));
	collection.addObject(Ember.Object.create({
		isActive: true,
		amount: 23
	}));

	assert.equal(collection.get("total"), 33);

	collection.addObject(Ember.Object.create({
		isActive: false,
		amount: 15
	}));

	assert.equal(collection.get("total"), 48);
});
