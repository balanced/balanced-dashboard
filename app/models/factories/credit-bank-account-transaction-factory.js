import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import TransactionFactory from "./transaction-factory";

/*
 * This factory uses the api feature of creating a Credit without creating a
 * BankAccount object.
 */
var CreditBankAccountTransactionFactory = TransactionFactory.extend({
	getDestinationAttributes: function() {
		return this.getProperties("account_number", "name", "routing_number", "account_type");
	},

	getAttributes: function() {
		var attributes = this.getProperties("amount", "appears_on_statement_as", "description");
		attributes.destination = this.getDestinationAttributes();
		return attributes;
	},

	save: function() {
		var Credit = BalancedApp.__container__.lookupFactory("model:credit");
		return Credit.create(this.getAttributes()).save();
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

export default CreditBankAccountTransactionFactory;
