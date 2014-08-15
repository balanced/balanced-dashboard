module("ApiKeyFactory");

test("business validations", function(assert) {
	var expectationsTest = function(attributes, expectations) {
		var subject = Balanced.ApiKeyFactory.create(attributes);
		subject.validate();
		var messages = subject.get("validationErrors.fullMessages");
		assert.deepEqual(messages, expectations);
	};


	expectationsTest({
		merchant: {
			type: "business",
		}
	}, [
		"merchant.phone_number can't be blank",
		"business.name must be present",
		"business.incorporation_date must be present",
		"business.tax_id is too short",
		"person.dob can't be blank",
		"person.dob does not match expected format YYYY-MM",
		"person.ssn_last_4 can't be blank",
		"person.ssn_last_4 is the wrong length (should be 4 characters)",
		"person.ssn_last_4 is invalid"
	]);

	expectationsTest({
		merchant: {
			type: "business",
			phone_number: ""
		},
		business: {
			incorporation_date: "   1000-20  "
		},
		person: {
			dob: "1000-xx",
			ssn_last_4: "000-333"
		}
	}, [
		"merchant.phone_number can't be blank",
		"business.name must be present",
		"business.incorporation_date \"1000-20\" has invalid month 20",
		"business.tax_id is too short",
		"person.dob does not match expected format YYYY-MM",
		"person.ssn_last_4 is the wrong length (should be 4 characters)",
		"person.ssn_last_4 is invalid"
	]);
});

test("person validations", function(assert) {
	var expectationsTest = function(attributes, expectations) {
		var subject = Balanced.ApiKeyFactory.create(attributes);
		subject.validate();
		var messages = subject.get("validationErrors.fullMessages");
		assert.deepEqual(messages, expectations);
	};

	expectationsTest({
		merchant: {
			type: "person",
			phone_number: "+123.4567.8901234567"
		},
	}, [
		"merchant.phone_number is too long (maximum 15 characters)",
		'merchant.phone_number has invalid characters (only "+", "-", "(", ")" spaces and numbers are accepted)',
		"person.dob can't be blank",
		"person.dob does not match expected format YYYY-MM",
		"person.ssn_last_4 can't be blank",
		"person.ssn_last_4 is the wrong length (should be 4 characters)",
		"person.ssn_last_4 is invalid"
	]);

	expectationsTest({
		merchant: {
			type: "person",
		},
		person: {
			ssn_last_4: "9999"
		}
	}, [
		"merchant.phone_number can't be blank",
		"person.dob can't be blank",
		"person.dob does not match expected format YYYY-MM"
	]);
});

test("#isBusiness", function(assert) {
	var subject = Balanced.ApiKeyFactory.create({
		merchant: {
			type: "person"
		}
	});
	assert.deepEqual(subject.get("isBusiness"), false);

	subject.set("merchant.type", "business");
	assert.deepEqual(subject.get("isBusiness"), true);
});

test("#handleResponse", function(assert) {
	var subject = Balanced.ApiKeyFactory.create();
	var result = subject.handleResponse({
		api_keys: [{
			secret: "cool-secret"
		}]
	});

	assert.deepEqual(result, "cool-secret");
});

test("#getMerchantAttributes (person)", function(assert) {
	var subject = Balanced.ApiKeyFactory.create({
		merchant: {
			type: "person",
			phone_number: "11111",
			postal_code: "99999"
		},
		business: {
			name: "Business Co. Inc."
		},
		person: {
			name: "Freddy Person",
			ssn_last_4: "1111",
		}
	});

	assert.deepEqual(subject.getMerchantAttributes(), {
		name: "Freddy Person",
		phone_number: "11111",
		postal_code: "99999",
		production: false,
		ssn_last_4: "1111",
		type: "person"
	});
});

test("#getMerchantAttributes (business)", function(assert) {
	var subject = Balanced.ApiKeyFactory.create({
		merchant: {
			type: "business",
			phone_number: "11111",
			postal_code: "99999"
		},
		business: {
			name: "Business Co. Inc."
		},
		person: {
			name: "Freddy Person",
			ssn_last_4: "1111",
		}
	});

	assert.deepEqual(subject.getMerchantAttributes(), {
		name: "Business Co. Inc.",
		person: {
			name: "Freddy Person",
			ssn_last_4: "1111"
		},
		phone_number: "11111",
		postal_code: "99999",
		production: false,
		type: "business"
	});
});

test("#getPostAttributes", function(assert) {
	var subject = Balanced.ApiKeyFactory.create();
	sinon.stub(subject, "getMerchantAttributes").returns({
		name: "Freddy Stub"
	});

	assert.deepEqual(subject.getPostAttributes(), {
		merchant: {
			name: "Freddy Stub"
		}
	});
});
