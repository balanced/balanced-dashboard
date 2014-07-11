var DATE_FORMAT = /^(\d\d\d\d)-(\d\d)$/;
var IS_PRODUCTION = false;
var validation = function(callback) {
	return {
		format: {
			validator: function(object, attribute, value) {
				var errors = object.get("validationErrors");
				callback(object, attribute, $.trim(value), errors);
			}
		}
	};
};

var isBusinessValidation = function(callback) {
	return validation(function(object, attribute, value, validationErrors) {
		if (object.get("isBusiness")) {
			callback(object, attribute, value, validationErrors);
		}
	});
};

var dateFormatValidation = function(value, attribute, validationErrors) {
	var match = value.match(DATE_FORMAT);
	var year;
	var month;
	if (match) {
		year = parseInt(match[1]);
		month = parseInt(match[2]);
	}

	if (!match) {
		validationErrors.add(attribute, "format", null, "does not match expected format YYYY-MM");
	} else {
		if (month > 12) {
			validationErrors.add(attribute, "format", null, '"%@" has invalid month %@'.fmt(value, month));
		}
		if (year === 0) {
			validationErrors.add(attribute, "format", null, '"%@" has invalid year %@'.fmt(value, year));
		}
	}
};

var VALID_TYPE_VALUES = ["person", "business"];
var VALID_COMPANY_TYPE_VALUES = [];

Balanced.ApiKeyFactory = Balanced.BaseFactory.extend({
	validations: {
		"merchant.type": validation(function(object, attribute, value, validationErrors) {
			if (!VALID_TYPE_VALUES.contains(value)) {
				var message = "must be person or business".fmt(VALID_TYPE_VALUES.join(", "));
				validationErrors.add(attribute, "inclusion", null, message);
			}
		}),
		"merchant.phone_number": validation(function(object, attribute, value, validationErrors) {
			if (value.length === 0) {
				validationErrors.add(attribute, "presence", null, "must be present");
			} else if (value.length > 15) {
				validationErrors.add(attribute, "length", null, "is too long");
			}
		}),

		"business.name": isBusinessValidation(function(object, attribute, value, validationErrors) {
			if (value.length === 0) {
				validationErrors.add(attribute, "presence", null, "must be present");
			}
		}),
		"business.incorporation_date": isBusinessValidation(function(object, attribute, value, validationErrors) {
			if (value.length === 0) {
				validationErrors.add(attribute, "presence", null, "must be present");
			} else {
				dateFormatValidation(value, attribute, validationErrors);
			}
		}),
		"business.tax_id": isBusinessValidation(function(object, attribute, value, validationErrors) {
			if (value.length < 4) {
				validationErrors.add(attribute, "length", null, "is too short");
			}
		}),

		"person.dob": validation(function(object, attribute, value, validationErrors) {
			if (value.length === 0) {
				validationErrors.add(attribute, "presence", null, "must be present");
			} else {
				dateFormatValidation(value, attribute, validationErrors);
			}
		}),
		"person.ssn_last_4": validation(function(object, attribute, value, validationErrors) {
			if (value.length < 4) {
				validationErrors.add(attribute, "length", null, "is too short");
			}
		})
	},

	isBusiness: Ember.computed.equal("merchant.type", "business"),

	getPostUrl: function() {
		return "/api_keys";
	},
	getPostAttributes: function() {
		return {
			merchant: this.getMerchantAttributes()
		};
	},
	handleResponse: function(response) {
		return response.api_keys[0].secret;
	},

	getMerchantAttributes: function() {
		var businessAttributes = this.get("business");
		var personAttributes = this.get("person");
		var merchantAttributes = this.get("merchant");

		if (this.get("isBusiness")) {
			return _.extend({
				production: IS_PRODUCTION
			}, merchantAttributes, businessAttributes, {
				person: personAttributes,
			});

		} else {
			return _.extend({
				production: IS_PRODUCTION
			}, merchantAttributes, personAttributes);
		}
	},
});
