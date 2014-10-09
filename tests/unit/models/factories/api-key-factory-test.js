import startApp from '../../../helpers/start-app';
import ApiKeyFactory from "balanced-dashboard/models/factories/api-key";
import BaseConnection from "balanced-dashboard/lib/connections/base-connection";

var Adapter, App;

module("Factory - ApiKeyFactory", {
	setup: function() {
		App = startApp();
		Adapter = App.__container__.lookup("adapter:main");
		sinon.stub(Adapter, "load").returns(Ember.RSVP.resolve({
			user: {}
		}));
	},
	teardown: function() {
		Ember.run(App, 'destroy');
	}
});

test("business validations", function() {
	var expectationsTest = function(attributes, expectations) {
		var subject = ApiKeyFactory.create(attributes);
		subject.validate();
		var messages = subject.get("validationErrors.fullMessages");
		deepEqual(messages, expectations);
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

test("person validations", function() {
	var expectationsTest = function(attributes, expectations) {
		var subject = ApiKeyFactory.create(attributes);
		subject.validate();
		var messages = subject.get("validationErrors.fullMessages");
		deepEqual(messages, expectations);
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

test("#isBusiness", function() {
	var subject = ApiKeyFactory.create({
		merchant: {
			type: "person"
		}
	});
	deepEqual(subject.get("isBusiness"), false);

	subject.set("merchant.type", "business");
	deepEqual(subject.get("isBusiness"), true);
});

test("#handleResponse", function() {
	var subject = ApiKeyFactory.create();
	var result = subject.handleResponse({
		api_keys: [{
			secret: "cool-secret"
		}]
	});

	deepEqual(result, "cool-secret");
});

test("#getMerchantAttributes (person)", function() {
	var subject = ApiKeyFactory.create({
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

	deepEqual(subject.getMerchantAttributes(), {
		name: "Freddy Person",
		phone_number: "11111",
		postal_code: "99999",
		production: true,
		ssn_last_4: "1111",
		type: "person"
	});
});

test("#getMerchantAttributes (business)", function() {
	var subject = ApiKeyFactory.create({
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

	deepEqual(subject.getMerchantAttributes(), {
		name: "Business Co. Inc.",
		person: {
			name: "Freddy Person",
			ssn_last_4: "1111"
		},
		phone_number: "11111",
		postal_code: "99999",
		production: true,
		type: "business"
	});
});

test("#getPostAttributes", function() {
	var subject = ApiKeyFactory.create();
	sinon.stub(subject, "getMerchantAttributes").returns({
		name: "Freddy Stub"
	});

	deepEqual(subject.getPostAttributes(), {
		merchant: {
			name: "Freddy Stub"
		}
	});
});

test("#_save", function() {
	expect(1);
	var stub = Adapter.load;
	var subject = ApiKeyFactory.create({
		person: {
			name: "Tom Person"
		},
		business: {
			name: "Important Inc."
		},
		merchant: {
			type: "person",
		}
	});
	subject._save();

	andThen(function() {
		var request = stub.args[0][0];
		deepEqual(JSON.parse(request.data), {
			merchant: {
				name: "Tom Person",
				production: true,
				type: "person"
			}
		});
	});
});
