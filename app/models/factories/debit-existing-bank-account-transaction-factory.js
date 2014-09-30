import DebitExistingFundingInstrumentTransactionFactory from "./debit-existing-funding-instrument-transaction-factory";
import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var DebitExistingBankAccountTransactionFactory = DebitExistingFundingInstrumentTransactionFactory.extend({
	validations: {
		dollar_amount: ValidationHelpers.positiveDollarAmount,
		appears_on_statement_as: ValidationHelpers.bankTransactionAppearsOnStatementAs,

		source_uri: {
			presence: true
		}
	}
});

export default DebitExistingBankAccountTransactionFactory;
