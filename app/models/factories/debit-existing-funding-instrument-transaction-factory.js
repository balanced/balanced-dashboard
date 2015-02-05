import TransactionFactory from "./transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import ValidationServerErrorHandler from "balanced-dashboard/utils/error-handlers/validation-server-error-handler";

var DebitExistingFundingInstrumentTransactionFactory = TransactionFactory.extend({
	appears_on_statement_max_length: Ember.computed.oneWay("source.appears_on_statement_max_length"),
	source_uri: Ember.computed.readOnly("source.uri"),
	getDebitAttributes: function() {
		var properties = this.getProperties("amount", "appears_on_statement_as", "description", "source_uri");
		properties.uri = this.get("source.debits_uri");
		return properties;
	},

	validations: {
		source: {
			presence: {
				message: "a source must be selected"
			}
		},
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,
	},

	save: function() {
		var Debit = BalancedApp.__container__.lookupFactory("model:debit");
		var self = this;
		this.validate();
		if (this.get("isValid")) {
			return Debit.create(this.getDebitAttributes())
				.save()
				.catch(function(response) {
					if (response.debits && response.debits.length > 0) {
						var debit = Debit.create();
						debit.setProperties({
							isNew: false,
							href: response.debits[0].href,
							uri: response.debits[0].href,
						});
						debit.populateFromJsonResponse(response);
						return debit;
					}
					else {
						var errorHandler = new ValidationServerErrorHandler(self, response);
						errorHandler.execute();
						return Ember.RSVP.reject(self);
					}
				});
		} else {
			return Ember.RSVP.reject(this);
		}
	}
});

export default DebitExistingFundingInstrumentTransactionFactory;
