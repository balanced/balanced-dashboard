import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import TransactionFactory from "./transaction-factory";
import ServerError from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";

/*
 * This factory uses the api feature of creating a Credit without creating a
 * BankAccount object.
 */
var CreditBankAccountTransactionFactory = TransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,

		name: ValidationHelpers.bankAccountName,
		routing_number: ValidationHelpers.bankAccountRoutingNumber,
		account_number: ValidationHelpers.bankAccountNumber,
		account_type: ValidationHelpers.bankAccountType,
	},

	getDestinationAttributes: function() {
		return this.getProperties("account_number", "name", "routing_number", "account_type");
	},

	getAttributes: function() {
		var attributes = this.getProperties("amount", "appears_on_statement_as", "description");
		attributes.destination = this.getDestinationAttributes();
		return attributes;
	},

	_save: function() {
		var Credit = BalancedApp.__container__.lookupFactory("model:credit");
		return Credit.create(this.getAttributes()).save();
	},

	handleErrorResponse: function(response) {
		this.setValidationErrorsFromServer(response);
	},

	setValidationErrorsFromServer: function(response) {
		var serverError = new ServerError(this, response);
		serverError.clear();
		serverError.execute();
	},

	save: function() {
		var self = this;

		this.get("validationErrors").clear();
		this.validate();

		if (this.get("isValid")) {
			return this._save().catch(function(xhr) {
				if (xhr.errors) {
					self.handleErrorResponse(xhr);
				}
				else if (xhr.responseJSON) {
					self.handleErrorResponse(xhr.responseJSON);
				}
				return Ember.RSVP.reject(self);
			});
		} else {
			return Ember.RSVP.reject(self);
		}
	},
});

export default CreditBankAccountTransactionFactory;
