import Card from "../card";

var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.DebitCardTransactionFactory = Balanced.TransactionFactory.extend({
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
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		name: ValidationHelpers.cardName,
		number: ValidationHelpers.cardNumber,
		cvv: ValidationHelpers.cardCvv,
		expiration_date: ValidationHelpers.cardExpirationDate,
	},

	save: function() {
		var deferred = Ember.RSVP.defer();

		var baseDebitAttributes = this.getDebitAttributes();
		this.validate();
		if (this.get("isValid")) {
			Card.create(this.getDestinationAttributes())
				.tokenizeAndCreate()
				.then(function(card) {
					var debitAttributes = _.extend({}, baseDebitAttributes, {
						uri: card.get('debits_uri'),
						source_uri: card.get('uri')
					});
					return Balanced.Debit.create(debitAttributes).save();
				})
				.then(function(model) {
					deferred.resolve(model);
				}, function() {
					deferred.reject();
				});
		} else {
			deferred.reject();
		}

		return deferred.promise;
	}
});
