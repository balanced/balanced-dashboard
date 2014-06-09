var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.TransactionFactory = Ember.Object.extend(Ember.Validations, {
	amount: function() {
		try {
			return "" + Balanced.Utils.dollarsToCents("" + this.get('dollar_amount'));
		} catch (e) {
			return undefined;
		}
	}.property("dollar_amount"),
});

Balanced.CardDebitTransactionFactory = Balanced.TransactionFactory.extend({
	getDestinationAttributes: function() {
		var attributes = this.getProperties("name", "number", "cvv", "expiration_month", "expiration_year");
		attributes.address = {
			postal_code: this.get("postal_code")
		};
		return attributes;
	},

	getDebitAttributes: function() {
		return this.getProperties("amount", "appears_on_statement_as", "description");
	},

	save: function() {
		var deferred = Ember.RSVP.defer();
		var self = this;
		var card = Balanced.Card.create(this.getDestinationAttributes());
		card.tokenizeAndCreate().then(function(card) {
			var debit = Balanced.Debit.create(self.getDebitAttributes());
			debit.setProperties({
				uri: card.get('debits_uri'),
				source_uri: card.get('uri')
			});
			return debit.save().then(function(debit) {
				deferred.resolve(debit);
			});
		});
		return deferred.promise;
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.transactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: ValidationHelpers.cardExpirationDate,
	}
});

Balanced.CreditBankAccountTransactionFactory = Balanced.TransactionFactory.extend({
	getDestinationAttributes: function() {
		return this.getProperties("account_number", "name", "routing_number", "account_type");
	},

	getAttributes: function() {
		var attributes = this.getProperties("amount", "appears_on_statement_as", "description");
		attributes.destination = this.getDestinationAttributes();
		return attributes;
	},

	save: function() {
		return Balanced.Credit.create(this.getAttributes()).save();
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.transactionAppearsOnStatementAs,

		name: ValidationHelpers.bankAccountName,
		routing_number: ValidationHelpers.bankAccountRoutingNumber,
		account_number: ValidationHelpers.bankAccountNumber,
		account_type: ValidationHelpers.bankAccountType,
	}
});
