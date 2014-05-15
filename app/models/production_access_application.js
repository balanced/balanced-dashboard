var objectProperty = function() {
	return function() {
		return Ember.Object.create({});
	}.property();
};

Balanced.ProductionAccessRequest = Balanced.Model.extend(Ember.Validations, {
	isPerson: Ember.computed.equal("applicationType", "PERSON"),
	isBusiness: Ember.computed.equal("applicationType", "BUSINESS"),
	isType: Ember.computed.or("isPerson", "isBusiness"),

	businessInformation: objectProperty(),
	personalInformation: objectProperty(),
	bankAccountInformation: objectProperty(),
	marketplaceInformation: objectProperty(),

	saveUser: function() {
		return Ember.RSVP.resolve();
	},

	dob: function() {
		var self = this;
		return ["dobYear", "dobMonth", "dobDay"].map(function(key) {
			var value = self.get(key).toString();
			return value.length === 1 ?
				("0"+ value) :
				value;
		}).join('-');
	}.property('personalInformation.dobYear', 'personalInformation.dobMonth', 'personalInformation.dobDay'),

	getPersonAttributes: function() {
		return {
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),

			name: this.get('personalInformation.name'),
			tax_id: this.get('personalInformation.socialSecurityNumber'),
			dob: this.get("dob")
		};
	},

	getPersonApiKeyAttributes: function() {
		var attributes = this.getPersonAttributes();
		attributes.type = "PERSON";
		return attributes;
	},

	getBusinessApiKeyAttributes: function() {
		var self = this;

		var setOptionalValue = function(attributes, valueName, keyName) {
			var value = self.get(valueName);
			if (value) {
				attributes[keyName] = value;
			}
		};

		var attributes = {
			type: "BUSINESS",
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('personalInformation.phoneNumber'),
			person: this.getPersonAttributes(),
		};

		setOptionalValue(attributes, "businessInformation.name", "name");
		setOptionalValue(attributes, "businessInformation.tax_id", "ein");
		return attributes;
	},

	saveApiKey: function() {
		var attributes = this.get("isBusiness") ?
			this.getBusinessApiKeyAttributes() :
			this.getPersonApiKeyAttributes();

		return Balanced.APIKey.create({
			merchant: attributes
		});
	},

	save: function() {
		var self = this;
		return Ember.RSVP.resolve();
	},

	validations: {

		"personalInformation.name": {
			presence: true,
		},
		"personalInformation.socialSecurityNumber": {
			presence: true,
			length: 4,
			numericality: true
		},
		"phoneNumber": {
			presence: true,
		},

		"streetAddress": {
			presence: true,
		},
		"postalCode": {
			presence: true,
			length: {
				minimum: 5,
				maximum: 10
			},
			format: /^\d{5}([\-]?\d{4})?$/
		},

		"bankAccountInformation.accountName": {
			presence: true,
		},
		"bankAccountInformation.accountNumber": {
			presence: true,
		},
		"bankAccountInformation.routingNumber": {
			presence: true,
			length: 9,
			matches: {
				validator: function(object, attribute, value) {
					if (window.balanced !== undefined && !balanced.bankAccount.validateRoutingNumber(value)) {
						object.get('validationErrors').add(attribute, 'invalid', null, 'Invalid routing number');
					}
				}
			}
		},
		"bankAccountInformation.accountType": {
			presence: true,
		},

		"marketplaceInformation.name": {
			presence: true,
		},
		"marketplaceInformation.supportEmailAddress": {
			presence: true,
		},
		"marketplaceInformation.supportPhoneNumber": {
			presence: true,
		},
		"marketplaceInformation.domainUrl": {
			presence: true,
		},

		termsAndConditions: {
			presence: {
				validator: function(object, attribute, value) {
					if (value !== true) {
						object.get('validationErrors').add(attribute, 'must be checked');
					}
				}
			}
		},
		email_address: {
			presence: {
				validator: function(object, attribute, value) {
					if (Balanced.Auth.get('isGuest') && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		password: {
			presence: {
				validator: function(object, attribute, value) {
					if (Balanced.Auth.get('isGuest') && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		}
	}
});
