Balanced.ProductionAccessRequest = Balanced.Model.extend(Ember.Validations, {
	isPerson: Ember.computed.equal("applicationType", "PERSON"),
	isBusiness: Ember.computed.equal("applicationType", "BUSINESS"),
	isType: Ember.computed.or("isPerson", "isBusiness"),

	getErrorObject: function() {
		var props = this.getProperties(
			"personName",
			// "socialSecurityNumber",
			"streetAddress",
			"postalCode",
			"phoneNumber",
			"dobYear",
			"dobMonth",
			"dobDay",

			"bankAccountType",
			"bankAccountNumber",
			"bankRoutingNumber",
			"bankAccountName",

			"marketplaceName",
			"supportEmailAddress",
			"supportPhoneNumber",
			"marketplaceDomainUrl"
		);
		if (this.get("socialSecurityNumber")) {
			props.socialSecurityNumber = "HIDDEN";
		} else {
			props.socialSecurityNumber = "EMPTY";
		}
		return props;
	},

	dob: function() {
		var self = this;
		return ["dobYear", "dobMonth", "dobDay"].map(function(key) {
			var value = self.get(key).toString();
			return value.length === 1 ?
				("0" + value) :
				value;
		}).join('-');
	}.property('dobYear', 'dobMonth', 'dobDay'),

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

		var setOptionalValue = function(attributes, valueName, keyName) {
			var value = self.get(valueName);
			if (value && _.isString(value) && value.length > 0) {
				attributes[keyName] = value;
			}
		};

		var attributes = {
			type: "BUSINESS",
			street_address: this.get('streetAddress'),
			postal_code: this.get('postalCode'),
			phone_number: this.get('phoneNumber'),
			person: this.getPersonAttributes(),
		};

		setOptionalValue(attributes, "businessName", "name");
		setOptionalValue(attributes, "employerIdentificationNumber", "ein");
		return attributes;
	},

	getApiKeyAttributes: function() {
		return this.get("isBusiness") ?
			this.getBusinessApiKeyAttributes() :
			this.getPersonApiKeyAttributes();
	},

	getMarketplaceAttributes: function() {
		return {
			name: this.get('marketplaceName'),
			support_email_address: this.get('supportEmailAddress'),
			support_phone_number: this.get('supportPhoneNumber'),
			domain_url: this.get('marketplaceDomainUrl')
		};
	},

	getBankAccountAttributes: function() {
		return {
			name: this.get('bankAccountName'),
			routing_number: this.get('bankRoutingNumber'),
			account_number: this.get('bankAccountNumber'),
			account_type: this.get('bankAccountType').toLowerCase()
		};
	},

	saveApiKey: function() {
		return Balanced.APIKey.create({
			merchant: this.getApiKeyAttributes()
		}).save();
	},

	saveUser: function() {
		var self = this;
		if (this.get("user")) {
			return Ember.RSVP.resolve(this.get("user"));
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
					Balanced.Auth.signIn(self.get("claimEmailAddress"), self.get("claimPassword"));
					return user;
				});
		}
	},

	saveMarketplace: function(apiKeySecret) {
		var object = Balanced.Marketplace.create(this.getMarketplaceAttributes());
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
		var object = Balanced.BankAccount.create(this.getBankAccountAttributes());
		object.tokenizeAndCreate(marketplace.get('links.owner_customer'));

		return object.save();
	},

	saveVerification: function(bankAccount) {
		var self = this;
		var object = Balanced.Verification.create({
			uri: bankAccount.get('bank_account_verifications_uri')
		});
		return object.save().then(undefined, function(response) {
			// If we got to this point the user already has a marketplace. We catch the
			// error so we can take them to the MP page even if the verification failed to create.
			Balanced.ErrorsLogger.captureMessage("Balanced.ProductionAccessRequest#saveVerification", {
				extra: {
					formFields: self.getErrorObject(),
					marketplaceId: self.get("marketplace.id")
				}
			});
		});
	},

	handleSaveError: function(error) {
		var message = "There was an unknown error creating your Marketplace. We have logged an error and will look into it. Please try again.";

		if (error.description === "Person KYC failed.") {
			message = "We could not verify your identity. Please check your information again and resubmit.";
		}

		this.requestErrors.addObject({
			object: error,
			message: message
		});
	},

	requestErrors: [],

	save: function() {
		var self = this;
		var apiKeySecret, marketplace, bankAccount, user;

		self.set("isSaving", true);
		self.requestErrors.clear();

		return self
			.saveUser()
			.then(function(response) {
				user = response;
				Balanced.Auth.unsetAPIKey();
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
				return self.saveUserMarketplace(apiKeySecret);
			})
			.then(function() {
				Balanced.Auth.setAPIKey(apiKeySecret);
				//  we need the api key to be associated with the user before we can create the bank account
				return user.reload();
			})
			.then(function() {
				return self.saveBankAccount(marketplace);
			})
			.then(function(response) {
				bankAccount = response;
				return self.saveVerification(bankAccount);
			})
			.then(function() {
				return marketplace;
			})
			.
		catch (function(error) {
			self.handleSaveError(error);
			return Ember.RSVP.reject(error);
		})
			.
		finally(function() {
			self.set("isSaving", false);
		});
	},

	validations: {
		personName: {
			presence: true,
		},
		socialSecurityNumber: {
			presence: true,
			length: 4,
			numericality: true
		},
		phoneNumber: {
			presence: true,
		},

		streetAddress: {
			presence: true,
		},
		postalCode: {
			presence: true,
			length: {
				minimum: 5,
				maximum: 10
			},
			format: /^\d{5}([\-]?\d{4})?$/
		},

		bankAccountName: {
			presence: true,
		},
		bankAccountNumber: {
			presence: true,
		},
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

		marketplaceName: {
			presence: true,
		},
		supportEmailAddress: {
			presence: true,
		},
		supportPhoneNumber: {
			presence: true,
		},
		marketplaceDomainUrl: {
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
