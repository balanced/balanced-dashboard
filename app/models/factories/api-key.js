import BaseFactory from "./base";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var DATE_FORMAT = /^(\d\d\d\d)-(\d\d)$/;
var IS_PRODUCTION = true;

var isBusinessValidation = function(callback) {
	return {
		format: {
			validator: function(object, attribute, value) {
				if (object.get("isBusiness")) {
					var errors = object.get("validationErrors");
					callback(object, attribute, $.trim(value), errors);
				}
			}
		}
	};
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
		if (month < 1 || month > 12) {
			validationErrors.add(attribute, "format", null, '"%@" has invalid month %@'.fmt(value, month));
		}
		if (year === 0) {
			validationErrors.add(attribute, "format", null, '"%@" has invalid year %@'.fmt(value, year));
		}
	}
};

var VALID_TYPE_VALUES = ["person", "business"];
var VALID_COMPANY_TYPE_VALUES = [];

var ApiKeyFactory = BaseFactory.extend({
	validations: {
		"merchant.type": {
			presence: true,
			inclusion: {
				validator: function(object, attribute, value) {
					var errors = object.get("validationErrors");
					if (!VALID_TYPE_VALUES.contains(value)) {
						var message = "must be person or business";
						errors.add(attribute, "inclusion", null, message);
					}
				}
			}
		},
		"merchant.phone_number": {
			presence: true,
			length: {
				maximum: 15,
			},
			format: {
				validator: ValidationHelpers.phoneNumberValidator
			}
		},

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

		"person.dob": {
			presence: true,
			format: {
				validator: function(object, attribute, value) {
					var validationErrors = object.get("validationErrors");
					dateFormatValidation($.trim(value), attribute, validationErrors);
				}
			}
		},

		"person.ssn_last_4": {
			presence: true,
			length: 4,
			format: /^\d\d\d\d$/
		}
	},

	isBusiness: Ember.computed.equal("merchant.type", "business"),

	_save: function() {
		return this.getConnection().createApiKey(this.getPostAttributes());
	},

	getPostAttributes: function() {
		return {
			merchant: this.getMerchantAttributes()
		};
	},
	handleResponse: function(response) {
		return response.api_keys[0].secret;
	},

	getPropertiesDump: function() {
		var attributes = this.getMerchantAttributes();
		var hideProperty = function(key) {
			var value = Ember.get(attributes, key);
			if (!Ember.isBlank(value)) {
				Ember.set(attributes, key, value.toString().replace(/\d/g, "x"));
			}
		};

		hideProperty("tax_id");
		hideProperty("ssn_last_4");
		hideProperty("person.ssn_last_4");
		hideProperty("business.tax_id");

		return attributes;
	},

	getMerchantAttributes: function() {
		var businessAttributes = this.get("business");
		var personAttributes = this.get("person");
		var merchantAttributes = this.get("merchant");

		if (this.get("isBusiness")) {
			return _.extend({
				production: IS_PRODUCTION
			}, merchantAttributes, businessAttributes, {
				person: _.extend({}, personAttributes),
			});

		} else {
			return _.extend({
				production: IS_PRODUCTION
			}, merchantAttributes, personAttributes);
		}
	},
});

export default ApiKeyFactory;
