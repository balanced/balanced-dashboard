module("Balanced.MarketplacesApplyController", {
	setup: function() {
		this.controller = Balanced.MarketplacesApplyController.create({
			error: {},
			content: {}
		});
		this.controller.resetError();
	}
});

test("#_extractValue", function(assert) {
	assert.deepEqual(this.controller._extractValue("cool"), "cool");
	assert.deepEqual(this.controller._extractValue(""), undefined);
});

test("#_extractBusinessApiKeyPayload", function(assert) {

	var methodStub = sinon.stub(Balanced.APIKey, "create");

	this.controller.setProperties({
		name: 'John Balanced',
		dob: '1980-5-27',
		address: {
			street_address: '965 Mission St',
			postal_code: '94103'
		},
		ssn_last4: '1234',
		phone_number: '(904) 628 1796',
		selectedType: 'BUSINESS',
		business_name: 'Balanced Inc',
		ein: '',
		incorporation_date: '2013-1-1',
		companyTypes: 'LLC'
	});
	this.controller._extractBusinessApiKeyPayload();

	assert.deepEqual(methodStub.firstCall.args[0], {
		merchant: {
			name: "Balanced Inc",
			person: {
				dob: "1980-5-27",
				name: "John Balanced",
				phone_number: "(904) 628 1796",
				postal_code: "94103",
				street_address: "965 Mission St",
				tax_id: "1234"
			},
			phone_number: "(904) 628 1796",
			postal_code: "94103",
			street_address: "965 Mission St",
			tax_id: undefined,
			type: "BUSINESS",
			incorporation_date: "2013-1-1",
			company_type: "LLC"
		}
	});

	this.controller.setProperties({
		name: 'John Balanced',
		dob: '1980-5-27',
		address: {
			street_address: '965 Mission St',
			postal_code: '94103'
		},
		ssn_last4: '1234',
		phone_number: '(904) 628 1796',
		selectedType: 'BUSINESS',
		business_name: 'Balanced Inc',
		ein: '123123123',
		incorporation_date: '2013-1-1',
		companyTypes: 'LLC'
	});
	this.controller._extractBusinessApiKeyPayload();

	assert.deepEqual(methodStub.secondCall.args[0], {
		merchant: {
			name: "Balanced Inc",
			person: {
				dob: "1980-5-27",
				name: "John Balanced",
				phone_number: "(904) 628 1796",
				postal_code: "94103",
				street_address: "965 Mission St",
				tax_id: "1234"
			},
			phone_number: "(904) 628 1796",
			postal_code: "94103",
			street_address: "965 Mission St",
			tax_id: '123123123',
			type: "BUSINESS",
			incorporation_date: "2013-1-1",
			company_type: "LLC"
		}
	});

});
