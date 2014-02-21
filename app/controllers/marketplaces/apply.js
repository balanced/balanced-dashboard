Balanced.MarketplacesApplyController = Balanced.ObjectController.extend({
	isLoading: false,
	termsAndConditions: false,

	actions: {
		selectType: function(applicationType) {
			var cls = 'selected';
			this.set('applicationType', applicationType);
			$('input:text', '#marketplace-apply').filter(function() {
				return this.value === '';
			}).first().focus();
			$('a', '.application-type').removeClass(cls).parent().find('.' + (applicationType || '').toLowerCase()).addClass(cls);
		},

		submitApplication: function() {
			var model = this.get('content');
			var superError = 'error critical';
			var $termsAndConditionsControlGroup = $('#terms-and-conditions').closest('.control-group');
			$termsAndConditionsControlGroup.removeClass(superError);
			if (!this.get('termsAndConditions')) {
				$termsAndConditionsControlGroup.addClass(superError).focus();
			}
			if (model.validate() && this.get('termsAndConditions')) {
				this.resetError();
				this.set('isLoading', true);

				// persist the request to the server, this will ultimately
				// be several requests so we need to be prepared on all of them for
				// failure.
				var user = this._extractLoginPayload(),
					apiKey = this._extractApiKeyPayload(),
					marketplace = this._extractMarketplacePayload(),
					bankAccount = this._extractBankAccountPayload();

				var modelsAndErrorHandlers = [{
					model: user,
					handler: this.userFailure
				}, {
					model: apiKey,
					handler: this.apiKeyFailure
				}, {
					model: marketplace,
					handler: this.marketplaceFailure
				}, {
					model: bankAccount,
					handler: this.bankingFailure
				}];

				var self = this;
				$.each(modelsAndErrorHandlers, function(_, thing) {
					if (thing.model) {
						thing.model.one('becameInvalid', $.proxy(thing.handler, self));
						thing.model.one('becameError', $.proxy(thing.handler, self));
					}
				});

				// create user (check for duplicate email address)
				// create api key (check for merchant underwrite failure)
				// create marketplace (should be no failure)
				// associate marketplace with user (should be no failure)
				// create bankAccount (possible failures but at this point we
				// should just swallow and send them to the marketplace management
				// page to re-add)
				this.send('signup', {
					user: user,
					apiKey: apiKey,
					marketplace: marketplace,
					bankAccount: bankAccount
				});
			} else {
				this.highlightError();
			}
		},
	},

	resetError: function() {
		this.set('error', {
			kyc: false,
			unknown: false,
			banking: false,
			marketplace: false,
			apiKey: false,
			user: false
		});
	},

	hasError: function() {
		var obj = this.get('error');
		var error = false;
		for (var key in obj) {
			if (obj[key] === true) {
				error = true;
			}
		}
		return error;
	}.property(
		'error.kyc', 'error.unknown', 'error.banking',
		'error.marketplace', 'error.apiKey', 'error.user'
	),

	errorMessage: function() {
		var obj = this.get('error');
		var message = '';
		if (this.get('hasError')) {
			if (obj.unknown === true) {
				message = 'An unknown error occurred.';
			}
			if (obj.banking === true) {
				message = 'There was a problem creating the bank account.';
			}
			if (obj.marketplace === true) {
				message = 'There was a problem creating the marketplace.';
			}
			if (obj.apiKey === true) {
				message = 'There was a problem creating the API key.';
			}
			if (obj.user === true) {
				message = 'There was a problem creating the user.';
			}
			if (obj.kyc === true) {
				message = 'We could not verify your identity.';
			}
			message += ' Please check your information again and resubmit.';
		}
		return message;
	}.property('hasError', 'error'),

	selectedType: function() {
		return this.get('applicationType');
	}.property('applicationType'),

	isBusiness: function() {
		return this.get('applicationType') === 'BUSINESS';
	}.property('applicationType'),

	isGuest: function() {
		return Balanced.Auth.get('isGuest');
	}.property('Balanced.Auth.isGuest'),

	dobYears: function() {
		var start = new Date().getFullYear() - 17;
		var years = Ember.A();
		for (var i = 0; i < 80; i++) {
			years.push(start - i);
		}
		return years;
	}.property(),

	dobMonths: Balanced.TIME.MONTHS,

	dobDays: Balanced.TIME.DAYS_IN_MONTH,

	dob: function() {
		var values = [
			this.get('dob_year'),
			this.get('dob_month'),
			this.get('dob_day')
		];
		values = $.map(values, function(value) {
			if (value) {
				return value;
			}
		});
		return values.join('-');
	}.property('dob_day', 'dob_month', 'dob_year'),

	userFailure: function(unparsedJson) {
		var self = this;
		var json = JSON.parse(unparsedJson);
		_.each(json, function(value, key) {
			self.get('validationErrors').add(key, 'invalid', null, value);
		});
		self.propertyDidChange('validationErrors');
		self.set('isLoading', false);
		self.highlightError();
	},

	apiKeyFailure: function(unparsedJson) {
		var self = this;
		var json = JSON.parse(unparsedJson);
		var errors = {};
		if (json.extras) {
			errors = json.extras;
		} else {
			if (json.description && (json.description.toLowerCase().indexOf('kyc failed') !== -1 || json.description.toLowerCase().indexOf('failed kyc') !== -1)) {
				var kycKeys = [
					'address.street_address',
					'address.postal_code',
					'dob_year',
					'name',
					'ssn_last4'
				];

				_.each(kycKeys, function(value) {
					errors[value] = 'Please check this entry';
				});

				self.set('error.kyc', true);
			}
		}
		_.each(errors, function(value, key) {
			self.get('validationErrors').add(key, 'invalid', null, value);
		});
		self.propertyDidChange('validationErrors');
		self.set('isLoading', false);
		self.highlightError();
	},

	marketplaceFailure: function(json) {
		var self = this;
		json = typeof json === 'object' ? json : JSON.parse(json);
		_.each(json.extras, function(value, key) {
			self.get('validationErrors').add('marketplace.%@'.fmt(key), 'invalid', null, value);
		});
		self.propertyDidChange('validationErrors');
		self.set('isLoading', false);
		self.highlightError();
	},

	bankingFailure: function(json) {
		var self = this;
		json = typeof json === 'object' ? json : JSON.parse(json);
		_.each(json.extras, function(value, key) {
			self.get('validationErrors').add('banking.%@'.fmt(key), 'invalid', null, value);
		});
		self.propertyDidChange('validationErrors');
		self.set('isLoading', false);
		self.highlightError();
	},

	highlightError: function() {
		window.setTimeout(function() {
			$('input', '#marketplace-apply .control-group.error:first').focus();
		}, 0);
	},

	accountTypes: ['checking', 'savings'],

	_extractApiKeyPayload: function() {
		var merchantType = this.get('selectedType'),
			isBusiness = merchantType === 'BUSINESS';

		var person = isBusiness ? {
			name: this.get('name'),
			dob: this.get('dob'),
			street_address: this.get('address.street_address'),
			postal_code: this.get('address.postal_code'),
			tax_id: this.get('ssn_last4'),
			phone_number: this.get('phone_number')
		} : null;
		var apiKey = Balanced.APIKey.create({
			merchant: {
				type: merchantType,
				name: this.get(isBusiness ? 'business_name' : 'name'),
				street_address: this.get('address.street_address'),
				postal_code: this.get('address.postal_code'),
				tax_id: this.get(isBusiness ? 'ein' : 'ssn_last4'),
				phone_number: this.get('phone_number')
			}
		});
		if (isBusiness) {
			apiKey.set('merchant.person', person);
		} else {
			apiKey.set('merchant.dob', this.get('dob'));
		}
		return apiKey;
	},

	_extractMarketplacePayload: function() {
		return Balanced.Marketplace.create({
			name: this.get('marketplace.name'),
			support_email_address: this.get('marketplace.support_email_address'),
			support_phone_number: this.get('marketplace.support_phone_number'),
			domain_url: this.get('marketplace.domain_url')
		});
	},

	_extractLoginPayload: function() {
		if (Balanced.Auth.get('isGuest')) {
			return Balanced.Claim.create({
				email_address: this.get('email_address'),
				password: this.get('password'),
				passwordConfirm: this.get('password')
			});
		}
	},

	_extractBankAccountPayload: function() {
		return Balanced.BankAccount.create({
			name: this.get('banking.account_name'),
			routing_number: this.get('banking.routing_number'),
			account_number: this.get('banking.account_number'),
			type: this.get('banking.account_type')
		});
	}
});
