var VALIDATE_PRESENCE = {
	presence: true
};
var ERROR_CATEGORY_EMAIL_EXISTS = "EmailAddressExists";
var isBlank = function(value) {
	return $.trim(value).length === 0;
};

var serializePersonFullName = function(self) {
	return ['personFirstName', 'personMiddleName', 'personLastName'].map(function(key) {
		return self.get(key);
	}).compact().join(" ");
};

var serializeDateFields = function(self) {
	var fields = _.toArray(arguments).slice(1);
	return fields.map(function(key) {
		var value = (self.get(key) || "").toString();
		return value.length === 1 ?
			("0" + value) :
			value;
	}).join('-');
};

var post = function(url, data, apiKey) {
	var options = {
		type: "POST",
		dataType: 'json',
		contentType: 'application/json; charset=UTF-8',
		accepts: {
			json: 'application/vnd.balancedpayments+json; version=1.1'
		},
		headers: {},
		data: JSON.stringify(data)
	};

	if (apiKey !== undefined) {
		_.extend(options.headers, {
			"Authorization": Balanced.Utils.encodeAuthorization(apiKey)
		});
	}

	return $.ajax(url, options);
};

var createApiKey = function(merchantInformation) {
	var data = {
		production: true,
		merchant: merchantInformation
	};
	return new Ember.RSVP.Promise(function(resolve, reject) {
		return post("https://api.balancedpayments.com/api_keys", data)
			.then(function(response) {
				return response.api_keys[0].secret;
			})
			.then(resolve, reject);
	});
};

var createMarketplace = function(data, secret) {
	return new Ember.RSVP.Promise(function(resolve, reject) {
		return post("https://api.balancedpayments.com/marketplaces", data, secret)
			.then(function(response) {
				var mp = Balanced.Marketplace.create({
					uri: response.marketplaces[0].uri
				});
				mp.populateFromJsonResponse(response);
				return mp;
			})
			.then(resolve, reject);
	});
};

var createUserMarketplace = function(user, secret) {
	return Balanced.UserMarketplace.create({
		uri: user.get('api_keys_uri'),
		secret: secret
	}).save();
};

var getErrorCategoryCode = function(error) {
	if (error.errors && error.errors[0]) {
		return error.errors[0].category_code;
	} else if (error.description) {
		return error.description;
	} else if (error.email_address && error.email_address[0] === "Email address already exists") {
		return ERROR_CATEGORY_EMAIL_EXISTS;
	} else {
		return "UNKNOWN CATEGORY";
	}
};

Balanced.ProductionAccessRequest = Balanced.Model.extend(Ember.Validations, {
	isPerson: Ember.computed.equal("applicationType", "PERSON"),
	isBusiness: Ember.computed.equal("applicationType", "BUSINESS"),
	isType: Ember.computed.or("isPerson", "isBusiness"),

	isCreateUserAccount: function() {
		var result = Balanced.Auth.get('isGuest');
		return result === undefined || result;
	},

	getErrorObject: function() {
		var self = this;
		var props = this.getProperties(
			'claimEmailAddress',

			"businessName",
			"principalOwnerName",
			"employerIdentificationNumber",
			"personFirstName",
			"personLastName",
			"streetAddress",
			"postalCode",
			"phoneNumber",
			"dobYear",
			"dobMonth",
			"dobDay",
			"incorporationYear",
			"incorporationMonth",
			"incorporationDay",
			"companyType",

			"marketplaceName",
			"supportEmailAddress",
			"supportPhoneNumber",

			"termsAndConditions",
			"marketplaceDomainUrl"
		);

		var hideField = function(fieldName) {
			var value = self.get(fieldName);
			var message = "HIDDEN";
			if (value === undefined) {
				message = "undefined";
			} else if (value === null) {
				message = "null";
			} else if (value.length === 0) {
				message = "empty string";
			}
			props[fieldName] = message;
		};

		hideField("claimPassword");
		hideField("socialSecurityNumber");
		hideField("employerIdentificationNumber");

		return props;
	},

	dob: function() {
		return serializeDateFields(this, "dobYear", "dobMonth", "dobDay");
	}.property('dobYear', 'dobMonth', 'dobDay'),

	incorporationDate: function() {
		return serializeDateFields(this, "incorporationYear", "incorporationMonth", "incorporationDay");
	}.property('incorporationYear', 'incorporationMonth', 'incorporationDay'),

	getPersonApiKeyAttributes: function() {
		return {
			type: "PERSON",
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),
			first_name: this.get('personFirstName'),
			middle_name: this.get('personMiddleName'),
			last_name: this.get('personLastName'),
			tax_id: this.get('socialSecurityNumber'),
			dob: this.get("dob")
		};
	},

	getBusinessApiKeyAttributes: function() {
		return {
			type: "BUSINESS",
			name: this.get('businessName'),
			principal_owner_name: this.get('principalOwnerName'),
			tax_id: this.get("employerIdentificationNumber"),

			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),

			incorporation_date: this.get('incorporationDate'),
			company_type: this.get('companyType'),

			person: {
				name: serializePersonFullName(this),
				tax_id: this.get('socialSecurityNumber'),
				dob: this.get("dob"),
				postal_code: this.get('postalCode'),
			}
		};
	},

	getMerchantAttributes: function() {
		return this.get("isBusiness") ?
			this.getBusinessApiKeyAttributes() :
			this.getPersonApiKeyAttributes();
	},

	saveUser: function() {
		var self = this;

		if (!self.isCreateUserAccount()) {
			return Ember.RSVP.resolve(self.get("user"));
		} else {
			var claim = Balanced.Claim.create({
				email_address: this.get('claimEmailAddress'),
				password: this.get('claimPassword'),
				passwordConfirm: this.get('claimPassword')
			});
			return claim
				.save()
				.then(function(user) {
					self.set("user", user);
					return user;
				});
		}
	},

	getMarketplaceAttributes: function() {
		return {
			name: this.get('marketplaceName'),
			support_email_address: this.get('supportEmailAddress'),
			support_phone_number: this.get('supportPhoneNumber'),
			domain_url: this.get('marketplaceDomainUrl')
		};
	},

	logSaveError: function(error) {
		var message = "Balanced.ProductionAccessRequest#" + getErrorCategoryCode(error);
		this.logSaveMessage(message, error);
	},

	logSaveMessage: function(message, error) {
		error = error || "Response not specified";

		var attributes = {
			response: error,
			formFields: this.getErrorObject(),
			marketplaceId: this.get("marketplace.id")
		};

		Balanced.ErrorsLogger.captureMessage(message, {
			extra: attributes
		});
	},

	handleSaveError: function(error) {
		var message = "There was an unknown error creating your Marketplace. We have logged an error and will look into it. Please try again.";
		var category = getErrorCategoryCode(error);

		if (category === "Person KYC failed." || category === "Business principal failed KYC.") {
			message = "We could not verify your identity. Please check your information again and resubmit.";
		} else if (category === "marketplace-already-created") {
			message = "A marketplace has already been created with this information. If you cannot access it please contact support at support@balancedpayments.com";
		} else if (category === ERROR_CATEGORY_EMAIL_EXISTS) {
			message = "An account with that email address already exists. Please log-in first.";
		}

		this.requestErrors.addObject({
			object: error,
			message: message
		});
	},

	requestErrors: [],

	save: function() {
		var apiKeySecret, marketplace, self = this;

		self.set("isSaving", true);
		self.requestErrors.clear();

		self.logSaveMessage("Started Marketplace Creation");

		return createApiKey(this.getMerchantAttributes())
			.then(function(secretApiKey) {
				apiKeySecret = secretApiKey;
				return createMarketplace(self.getMarketplaceAttributes(), secretApiKey);
			})
			.then(function(mp) {
				marketplace = mp;
				self.logSaveMessage("MarketplaceCreated", mp.get("id"));
				return mp;
			})
			.then(function() {
				return self.saveUser();
			})
			.then(function(user) {
				createUserMarketplace(user, apiKeySecret);
			})
			.then(function() {
				Balanced.Auth.setAPIKey(apiKeySecret);

				if (self.get("claimEmailAddress") && self.get("claimPassword")) {
					Balanced.Auth.signIn(self.get("claimEmailAddress"), self.get("claimPassword"));
				}
				self.get("user").reload();
			})
			.then(function() {
				self.set("isSaving", false);
				return marketplace;
			}, function(error) {
				self.set("isSaving", false);
				self.handleSaveError(error);
				self.logSaveError(error);
				return Ember.RSVP.reject(marketplace);
			});
	},

	validations: {
		employerIdentificationNumber: {
			presence: {
				validator: function(object, attribute, value) {
					if (object.get("isBusiness") && isBlank(value)) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		businessName: {
			presence: {
				validator: function(object, attribute, value) {
					if (object.get("isBusiness") && isBlank(value)) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		principalOwnerName: VALIDATE_PRESENCE,
		personFullName: {
			presence: {
				validator: function(object, attribute, value) {
					var isFirstName = object.get("personFirstName.length") > 0;
					var isLastName = object.get("personLastName.length") > 0;
					if (!isFirstName || !isLastName) {
						object.get("validationErrors").add(attribute, "blank", null, "must include first and last name");
					}
				}
			}
		},
		socialSecurityNumber: {
			presence: true,
			length: 4,
			numericality: true
		},
		phoneNumber: VALIDATE_PRESENCE,

		streetAddress: VALIDATE_PRESENCE,
		postalCode: {
			presence: true,
			length: {
				minimum: 5,
				maximum: 10
			},
			format: /^\d{5}([\-]?\d{4})?$/
		},
		companyType: VALIDATE_PRESENCE,

		marketplaceName: VALIDATE_PRESENCE,
		supportEmailAddress: VALIDATE_PRESENCE,
		supportPhoneNumber: VALIDATE_PRESENCE,
		marketplaceDomainUrl: VALIDATE_PRESENCE,

		termsAndConditions: {
			presence: {
				validator: function(object, attribute, value) {
					if (value !== true) {
						object.get('validationErrors').add(attribute, 'checked', null, "must be checked");
					}
				}
			}
		},

		claimEmailAddress: {
			presence: {
				validator: function(object, attribute, value) {
					if (object.isCreateUserAccount() && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		},
		claimPassword: {
			presence: {
				validator: function(object, attribute, value) {
					if (object.isCreateUserAccount() && !value) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			}
		}
	}
});
