import Ember from "ember";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import TransactionFactory from "./transaction-factory";

var CreditExistingFundingInstrumentTransactionFactory = TransactionFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("destination.appears_on_statement_max_length"),
	destination_uri: Ember.computed.readOnly("destination.uri"),

	getCreditAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as", "description", "destination_uri");
		properties.uri = this.get("destination.credits_uri");

		if (this.get("order.href")) {
			properties.order_uri = this.get("order.href");
		}
		return properties;
	},

	save: function() {
		var Credit = BalancedApp.__container__.lookupFactory("model:credit");

		this.validate();
		if (this.get("isValid")) {
			return Credit.create(this.getCreditAttributes()).save();
		} else {
			return Ember.RSVP.reject();
		}
	},

	validations: {
		destination_uri: {
			presence: true
		},
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs
	}
});

export default CreditExistingFundingInstrumentTransactionFactory;
