var PRESENCE_VALIDATOR = {
	presence: true
};
var BUSINESS_PRESENCE_VALIDATOR = {
	presence: {
		validator: function(object, attribute, value) {
			if (object.get("isBusiness") && $.trim(value).length === 0) {
				object.get('validationErrors').add(attribute, 'blank');
			}
		}
	}
};

var ERROR_CATEGORY_EMAIL_EXISTS = "EmailAddressExists";

var serializeDate = function(self, fieldNames) {
	return fieldNames.map(function(key) {
		var value = self.get(key).toString();
		return value.length === 1 ?
			("0" + value) :
			value;
	}).join('-');
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
			"employerIdentificationNumber",
			"companyType",

			"personName",
			"streetAddress",
			"postalCode",
			"phoneNumber",
			"dobYear",
			"dobMonth",
			"dobDay",

			"bankAccountType",
			"bankRoutingNumber",
			"bankAccountName",

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
		hideField("bankAccountNumber");
		hideField("employerIdentificationNumber");

		return props;
	},

	dob: function() {
		return serializeDate(this, ["dobYear", "dobMonth", "dobDay"]);
	}.property('dobYear', 'dobMonth', 'dobDay'),

	incorporationDate: function() {
		return serializeDate(this, ["incorporationYear", "incorporationMonth", "incorporationDay"]);
	}.property("incorporationYear", "incorporationMonth", "incorporationDay"),

	getPersonAttributes: function() {
		return {
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),

			name: this.get('personName'),
			tax_id: this.get('socialSecurityNumber'),
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
		var attributes = {
			type: "BUSINESS",
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),
			person: this.getPersonAttributes(),

			principal_owner_name: this.get('principalOwnerName'),
			name: this.get("businessName"),

			company_type: this.get('companyType'),
			incorporation_date: this.get('incorporationDate'),
			tax_id: this.get("employerIdentificationNumber")
		};

		return attributes;
	},

	saveApiKey: function() {
		var attributes = this.get("isBusiness") ?
			this.getBusinessApiKeyAttributes() :
			this.getPersonApiKeyAttributes();

		return Balanced.APIKey.create({
			production: true,
			merchant: attributes
		}).save();
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
					Balanced.Auth.signIn(self.get("claimEmailAddress"), self.get("claimPassword"));
					self.set("user", user);
					return user;
				});
		}
	},

	saveMarketplace: function(apiKeySecret) {
		var object = Balanced.Marketplace.create({
			name: this.get('marketplaceName'),
			support_email_address: this.get('supportEmailAddress'),
			support_phone_number: this.get('supportPhoneNumber'),
			domain_url: this.get('marketplaceDomainUrl')
		});
		var settings = {
			headers: {
				Authorization: Balanced.Utils.encodeAuthorization(apiKeySecret)
			}
		};
		return object.save(settings);
	},

	saveUserMarketplace: function(apiKeySecret) {
		var self = this;
		var object = Balanced.UserMarketplace.create({
			uri: this.get("user.api_keys_uri"),
			secret: apiKeySecret
		});
		return object.save();
	},

	saveBankAccount: function(marketplace) {
		var self = this;
		var object = Balanced.BankAccount.create({
			name: this.get('bankAccountName'),
			routing_number: this.get('bankRoutingNumber'),
			account_number: this.get('bankAccountNumber'),
			account_type: this.get('bankAccountType').toLowerCase()
		});
		return object.tokenizeAndCreate(marketplace.get('links.owner_customer'));
	},

	saveVerification: function(bankAccount) {
		return Balanced.Verification.create({
			uri: bankAccount.get('bank_account_verifications_uri')
		}).save();
	},

	logValidationErrors: function() {
		this.logSaveMessage("Balanced.ProductionAccessRequest#ValidationError", {
			validationMessages: this.get("validationErrors.allMessages")
		});
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

	createMarketplace: function() {
		var self = this;
		var apiKeySecret, marketplace;

		return self
			.saveUser()
			.then(function(response) {
				return self.saveApiKey();
			})
			.then(function(response) {
				apiKeySecret = response.get('secret');
				Balanced.Auth.setAPIKey(apiKeySecret);
				return self.saveMarketplace(apiKeySecret);
			})
			.then(function(mp) {
				self.set("marketplace", mp);
				marketplace = mp;
				self.logSaveMessage("MarketplaceCreated");
				return self.saveUserMarketplace(apiKeySecret);
			})
			.then(function() {
				Balanced.Auth.setAPIKey(apiKeySecret);
				// we need the api key to be associated with the user before we can
				// create the bank account
				return self.get("user").reload();
			})
			.then(function() {
				return marketplace;
			});
	},

	verifyBankAccount: function(marketplace) {
		var self = this;
		return self
			.saveBankAccount(marketplace)
			.then(function(bankAccount) {
				return self.saveVerification(bankAccount);
			})
			.
		catch(function(error) {
			Balanced.ErrorsLogger.captureMessage("Balanced.ProductionAccessRequest", {
				extra: {
					response: error,
					formFields: self.getErrorObject(),
					marketplaceId: self.get("marketplace.id")
				}
			});
		})
			.then(function() {
				return marketplace;
			});
	},

	save: function() {
		var self = this;
		var marketplace;

		self.set("isSaving", true);
		self.requestErrors.clear();

		// Once the Marketplace is created and linked we take the user to the MP
		// page. We rescue the bank account creation and verification process and
		// continue to the success process
		return self.createMarketplace()
			.then(function(mp) {
				marketplace = mp;
				self.logSaveMessage("Successful Marketplace Signup");
				return self.verifyBankAccount(marketplace).
				catch(function(error) {
					self.logSaveError(error);
				});
			}, function(error) {
				self.handleSaveError(error);
				self.logSaveError(error);
				return Ember.RSVP.reject(marketplace);
			})
			.
		finally(function() {
			self.set("isSaving", false);
			return marketplace;
		});
	},

	validations: {
		businessName: BUSINESS_PRESENCE_VALIDATOR,
		employerIdentificationNumber: BUSINESS_PRESENCE_VALIDATOR,
		principalOwnerName: BUSINESS_PRESENCE_VALIDATOR,
		companyType: {
			presence: {
				validator: function(object, attribute, value) {
					if (object.get("isBusiness") && $.trim(value).length === 0) {
						object.get('validationErrors').add(attribute, 'blank');
					}
				}
			},
			included: {
				validator: function(object, attribute, value) {
					var acceptedValues = Balanced.Marketplace.COMPANY_TYPES.map(function(v) {
						return v.value;
					});
					if (object.get("isBusiness") && !Balanced.Marketplace.COMPANY_TYPES.isAny("value", value)) {
						object.get('validationErrors').add(attribute, 'included', null, 'must be one of %@'.fmt(acceptedValues.join(", ")));
					}
				},
			}
		},

		personName: PRESENCE_VALIDATOR,
		socialSecurityNumber: {
			presence: true,
			length: 4,
			numericality: true
		},
		phoneNumber: PRESENCE_VALIDATOR,
		streetAddress: PRESENCE_VALIDATOR,
		postalCode: {
			presence: true,
			length: {
				minimum: 5,
				maximum: 10
			},
			format: /^\d{5}([\-]?\d{4})?$/
		},

		bankAccountName: PRESENCE_VALIDATOR,
		bankAccountNumber: PRESENCE_VALIDATOR,
		bankRoutingNumber: {
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
		bankAccountType: {
			presence: true,
			matches: {
				validator: function(object, attribute, value) {
					if (Balanced.BankAccount.ACCOUNT_TYPES.indexOf(value) < 0) {
						object.get('validationErrors').add(attribute, 'invalid', null, 'Invalid bank acount type');
					}
				}
			}
		},

		marketplaceName: PRESENCE_VALIDATOR,
		supportEmailAddress: PRESENCE_VALIDATOR,
		supportPhoneNumber: PRESENCE_VALIDATOR,
		marketplaceDomainUrl: PRESENCE_VALIDATOR,

		termsAndConditions: {
			presence: {
				validator: function(object, attribute, value) {
					if (value !== true) {
						object.get('validationErrors').add(attribute, 'checked', null, 'must be checked');
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
