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
		"merchant.phone_number must be present",
		"business.name must be present",
		"business.incorporation_date must be present",
		"business.tax_id is too short",
		"person.dob must be present",
		"person.ssn_last_4 is too short"
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
			dob: "1000-xx"
		}
	}, [
		"merchant.phone_number must be present",
		"business.name must be present",
		"business.incorporation_date \"1000-20\" has invalid month 20",
		"business.tax_id is too short",
		"person.dob does not match expected format YYYY-MM",
		"person.ssn_last_4 is too short"
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
			phone_number: ""
		},
	}, [
		"merchant.phone_number must be present",
		"person.dob must be present",
		"person.ssn_last_4 is too short"
	]);

	expectationsTest({
		merchant: {
			type: "person",
		},
		person: {
			ssn_last_4: "9999"
		}
	}, [
		"merchant.phone_number must be present",
		"person.dob must be present",
	]);
});
