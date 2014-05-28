module("Balanced.ProductionAccessRequest");

test("#getErrorObject", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "HIDDEN",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: "1980",
		dobMonth: "1",
		dobDay: "31",

		marketplaceName: "Big Bird's Pillows",
		supportEmailAddress: "bird@example.com",
		supportPhoneNumber: "900 123 0099",
		marketplaceDomainUrl: "example.domain",

		claimPassword: "password",
		claimEmailAddress: "bird@example.com"
	});

	assert.deepEqual(subject.getErrorObject(), {
		personName: "Big Bird",
		socialSecurityNumber: "HIDDEN",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: "1980",
		dobMonth: "1",
		dobDay: "31",

		bankAccountName: undefined,
		bankAccountNumber: "undefined",
		bankAccountType: undefined,
		bankRoutingNumber: undefined,

		businessName: undefined,
		employerIdentificationNumber: "undefined",

		marketplaceName: "Big Bird's Pillows",
		supportEmailAddress: "bird@example.com",
		supportPhoneNumber: "900 123 0099",
		marketplaceDomainUrl: "example.domain",

		termsAndConditions: undefined,

		claimPassword: "HIDDEN",
		claimEmailAddress: "bird@example.com"
	});

});

test("#isBusiness", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		applicationType: "BUSINESS"
	});

	assert.ok(subject.get("isBusiness"));

	subject = Balanced.ProductionAccessRequest.create({
		applicationType: "PERSON"
	});

	assert.ok(!subject.get("isBusiness"));
});

test("#isPerson", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		applicationType: "BUSINESS"
	});
	assert.ok(!subject.get("isPerson"));

	subject = Balanced.ProductionAccessRequest.create({
		applicationType: "PERSON"
	});
	assert.ok(subject.get("isPerson"));
});

test("#dob", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.equal(subject.get("dob"), "1980-01-31");
});

test("#getPersonAttributes", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "1111",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.deepEqual(subject.getPersonAttributes(), {
		street_address: "123 Sesame St",
		postal_code: "98210",
		phone_number: "111 234 0099",

		dob: "1980-01-31",
		name: "Big Bird",
		tax_id: "1111",
	});
});

test("#getPersonApiKeyAttributes", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "1111",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.deepEqual(subject.getPersonApiKeyAttributes(), {
		type: "PERSON",
		street_address: "123 Sesame St",
		postal_code: "98210",
		phone_number: "111 234 0099",

		dob: "1980-01-31",
		name: "Big Bird",
		tax_id: "1111",
	});
});

test("#getBusinessApiKeyAttributes", function(assert) {
	var subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "1111",
		businessName: "Street Enterprises",
		employerIdentificationNumber: "000001111",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.deepEqual(subject.getBusinessApiKeyAttributes(), {
		type: "BUSINESS",
		street_address: "123 Sesame St",
		postal_code: "98210",
		phone_number: "111 234 0099",
		tax_id: "000001111",
		name: "Street Enterprises",

		person: {
			street_address: "123 Sesame St",
			postal_code: "98210",
			phone_number: "111 234 0099",

			dob: "1980-01-31",
			name: "Big Bird",
			tax_id: "1111"
		}
	});

	subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "1111",
		employerIdentificationNumber: "000001111",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.deepEqual(subject.getBusinessApiKeyAttributes(), {
		type: "BUSINESS",
		street_address: "123 Sesame St",
		postal_code: "98210",
		phone_number: "111 234 0099",
		tax_id: "000001111",
		person: {
			street_address: "123 Sesame St",
			postal_code: "98210",
			phone_number: "111 234 0099",

			dob: "1980-01-31",
			name: "Big Bird",
			tax_id: "1111"
		}
	});

	subject = Balanced.ProductionAccessRequest.create({
		personName: "Big Bird",
		socialSecurityNumber: "1111",
		streetAddress: "123 Sesame St",
		postalCode: "98210",
		phoneNumber: "111 234 0099",
		dobYear: 1980,
		dobMonth: 1,
		dobDay: 31
	});

	assert.deepEqual(subject.getBusinessApiKeyAttributes(), {
		type: "BUSINESS",
		street_address: "123 Sesame St",
		postal_code: "98210",
		phone_number: "111 234 0099",
		person: {
			street_address: "123 Sesame St",
			postal_code: "98210",
			phone_number: "111 234 0099",

			dob: "1980-01-31",
			name: "Big Bird",
			tax_id: "1111"
		}
	});
});
