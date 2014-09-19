var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.CardDebitBaseTransactionFactory = Balanced.TransactionFactory.extend({
	save: function() {
		var self = this;
		var card = Balanced.Card.create(this.getDestinationAttributes());
		return card.tokenizeAndCreate().then(function(card) {
			var debitAttributes = _.extend(self.getDebitAttributes(), {
				uri: card.get('debits_uri'),
				source_uri: card.get('uri')
			});

			return Balanced.Debit.create(debitAttributes).save();
		});
	}
});

Balanced.DebitExistingBankAccountTransactionFactory = Balanced.DebitExistingFundingInstrumentTransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,

		source_uri: {
			presence: true
		}
	}
});

Balanced.DebitExistingCardTransactionFactory = Balanced.DebitExistingFundingInstrumentTransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		source_uri: {
			presence: true
		}
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
