require('app/models/funding_instrument');

Balanced.BankAccount = Balanced.FundingInstrument.extend({
	uri: '/bank_accounts',

	verifications: Balanced.Model.hasMany('bank_account_verifications', 'Balanced.Verification'),
	verification: Balanced.Model.belongsTo('bank_account_verification', 'Balanced.Verification'),

	type_name: function() {
		return 'Bank Account';
	}.property(),

	route_name: function() {
		return 'bank_accounts';
	}.property(),

	is_bank_account: true,

	account_type_name: function() {
		return this.get('account_type');
	}.property('type', 'account_type'),

	appears_on_statement_max_length: function() {
		return Balanced.MAXLENGTH.APPEARS_ON_STATEMENT_BANK_ACCOUNT;
	}.property(),

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
			return '%@ (%@)'.fmt(
				this.get('last_four'),
				Balanced.Utils.toTitleCase(this.get('bank_name'))
			);
		} else {
			return this.get('last_four');
		}
	}.property('last_four', 'bank_name'),

	can_verify: function() {
		return !this.get('can_debit') && !this.get('can_confirm_verification') &&
			this.get('customer');
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
			type: this.get('type'),
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

Balanced.TypeMappings.addTypeMapping('bank_account', 'Balanced.BankAccount');
