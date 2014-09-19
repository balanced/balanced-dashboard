Balanced.BankAccount = Balanced.FundingInstrument.extend({
	uri: '/bank_accounts',

	verifications: Balanced.Model.hasMany('bank_account_verifications', 'Balanced.Verification'),
	verification: Balanced.Model.belongsTo('bank_account_verification', 'Balanced.Verification'),

	isBankAccount: true,

	type_name: function() {
		if (this.get('account_type') === 'savings') {
			return 'Savings account';
		} else {
			return 'Checking account';
		}
	}.property('account_type'),

	route_name: 'bank_accounts',
	account_type_name: Ember.computed.alias('type_name'),
	appears_on_statement_max_length: Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT,
	expected_credit_days_offset: Balanced.EXPECTED_CREDIT_DAYS_OFFSET.ACH,
	page_title: Ember.computed.readOnly('description'),

	last_four: function() {
		var accountNumber = this.get('account_number');
		if (!accountNumber || accountNumber.length < 5) {
			return accountNumber;
		} else {
			return accountNumber.substr(accountNumber.length - 4, 4);
		}
	}.property('account_number'),

	description: function() {
		if (this.get('bank_name')) {
			return '%@ %@'.fmt(
				this.get('last_four'),
				Balanced.Utils.toTitleCase(this.get('bank_name'))
			);
		} else {
			return this.get('last_four');
		}
	}.property('last_four', 'bank_name'),


	status: Ember.computed.oneWay("verificationStatus"),

	customer: function() {
		if (this.get("customer_uri")) {
			return Balanced.Customer.find(this.get("customer_uri"));
		}
	}.property("customer_uri"),

	verificationStatus: function() {
		if (this.get("isRemoved")) {
			return "removed";
		} else if (this.get("isVerified")) {
			return "verified";
		} else if (this.get('customer')) {
			if (this.get('can_confirm_verification')) {
				return 'pending';
			} else {
				return 'unverified';
			}
		} else {
			return 'unverifiable';
		}
	}.property('isRemoved', 'isVerified', 'customer', 'can_confirm_verification'),

	isVerified: Ember.computed.oneWay("can_debit"),
	isRemoved: Ember.computed.not("can_credit"),

	can_verify: function() {
		return !this.get('can_debit') && !this.get('can_confirm_verification') && this.get('customer');
	}.property('can_debit', 'can_confirm_verification', 'customer'),

	can_confirm_verification: function() {
		return this.get('verification') &&
			this.get('verification.verification_status') !== 'failed' &&
			this.get('verification.verification_status') !== 'verified' &&
			this.get('verification.attempts_remaining') > 0;
	}.property('verification', 'verification.verification_status', 'verification.attempts_remaining'),

	tokenizeAndCreate: function(customerId) {
		var self = this;
		var promise = this.resolveOn('didCreate');

		function errorCreatingBankAccount(err) {
			Ember.run.next(function() {
				self.setProperties({
					displayErrorDescription: true,
					isSaving: false,
					errorDescription: 'There was an error processing your bank account. ' + (Ember.get(err, 'errorDescription') || ''),
					validationErrors: Ember.get(err, 'validationErrors') || {}
				});
			});
			promise.reject(err);
		}

		this.set('isSaving', true);
		var bankAccountData = {
			account_type: this.get('account_type'),
			name: this.get('name'),
			account_number: $.trim(this.get('account_number')),
			routing_number: $.trim(this.get('routing_number'))
		};

		// Tokenize the bank account using the balanced.js library
		balanced.bankAccount.create(bankAccountData, function(response) {
			if (response.errors) {
				var validationErrors = Balanced.Utils.extractValidationErrorHash(response);
				self.setProperties({
					validationErrors: validationErrors,
					isSaving: false
				});

				if (!validationErrors) {
					var errorSuffix = (response.errors && response.errors.length > 0 && response.errors[0].description) ? (': ' + response.errors[0].description) : '.';
					self.setProperties({
						displayErrorDescription: true,
						errorDescription: 'Sorry, there was an error tokenizing this bank account' + errorSuffix
					});
				}

				promise.reject(validationErrors);
			} else {
				Balanced.BankAccount.find(response.bank_accounts[0].href)
				// Now that it's been tokenized, we just need to associate it with the customer's account
				.then(function(bankAccount) {
					bankAccount.set('links.customer', customerId);

					bankAccount.save().then(function(account) {
						self.setProperties({
							isSaving: false,
							isNew: false,
							isLoaded: true
						});

						self.updateFromModel(account);
						self.trigger('didCreate');
					}, errorCreatingBankAccount);
				}, errorCreatingBankAccount);
			}
		});

		return promise;
	}
});

Balanced.BankAccount.reopenClass({
	ACCOUNT_TYPES: ["Checking", "Savings"]
});

export default Balanced.BankAccount;
