import Ember from "ember";
import Credit from "../credit";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import TransactionFactory from "./transaction-factory";

var CreditExistingFundingInstrumentTransactionFactory = TransactionFactory.extend({
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
		return Credit.create(this.getCreditAttributes()).save();
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

export default CreditExistingFundingInstrumentTransactionFactory;
