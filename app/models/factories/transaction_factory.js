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

Balanced.CardDebitBaseTransactionFactory = Balanced.TransactionFactory.extend({
	save: function() {
		var deferred = Ember.RSVP.defer();
		var self = this;
		var card = Balanced.Card.create(this.getDestinationAttributes());
		card.tokenizeAndCreate().then(function(card) {
			var debitAttributes = _.extend(self.getDebitAttributes(), {
				uri: card.get('debits_uri'),
				source_uri: card.get('uri')
			});

			return Balanced.Debit
				.create(debitAttributes)
				.save()
				.then(function(debit) {
					deferred.resolve(debit);
				});
		});
		return deferred.promise;
	},
});

Balanced.CardDebitTransactionFactory = Balanced.CardDebitBaseTransactionFactory.extend({
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

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.transactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: ValidationHelpers.cardExpirationDate,
	}
});

Balanced.InitialDepositTransactionFactory = Balanced.CardDebitBaseTransactionFactory.extend({
	card_uri: Ember.computed.oneWay("marketplace.owner_customer.cards_uri"),

	getDestinationAttributes: function() {
		var attributes = this.getProperties("number", "cvv", "expiration_month", "expiration_year");
		_.extend(attributes, {
			uri: this.get("card_uri"),
			address: {
				postal_code: this.get("postal_code")
			}
		});
		return attributes;
	},

	getDebitAttributes: function() {
		return this.getProperties("amount");
	},

	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
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
