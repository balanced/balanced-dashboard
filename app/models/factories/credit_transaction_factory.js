var ValidationHelpers = Balanced.ValidationHelpers;

Balanced.CreditExistingFundingInstrumentTransactionFactory = Balanced.TransactionFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("destination.appears_on_statement_max_length"),
	destination_uri: Ember.computed.readOnly("destination.uri"),

	getCreditAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as", "description", "destination_uri");
		properties.uri = this.get("destination.credits_uri");

		if (this.get("order.href")) {
			properties.order = this.get("order.href");
		}
		return properties;
	},

	save: function() {
		return Balanced.Credit.create(this.getCreditAttributes()).save();
	},

	validations: {
		destination_uri: {
			presence: true
		},
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: {
			presence: true,
			format: ValidationHelpers.generateTransactionAppearsOnStatementFormatValidation("appears_on_statement_max_length")
		},
	}
});

/*
 * This factory uses the api feature of creating a Credit without creating a
 * BankAccount object.
 */
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
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,

		name: ValidationHelpers.bankAccountName,
		routing_number: ValidationHelpers.bankAccountRoutingNumber,
		account_number: ValidationHelpers.bankAccountNumber,
		account_type: ValidationHelpers.bankAccountType,
	}
});
