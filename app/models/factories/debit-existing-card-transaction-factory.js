import DebitExistingFundingInstrumentTransactionFactory from "./debit-existing-funding-instrument-transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";
import Card from "../card";
import Debit from "../debit";

var DebitExistingCardTransactionFactory = DebitExistingFundingInstrumentTransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.cardTransactionAppearsOnStatementAs,

		source_uri: {
			presence: true
		}
	}
});

export default DebitExistingCardTransactionFactory;
