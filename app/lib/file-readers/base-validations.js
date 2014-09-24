import ValidationHelpers from "balanced-dashboard/utils/validation-helpers";

var baseValidationsObject = {
	"csvFields.appears_on_statement_as": ValidationHelpers.bankTransactionAppearsOnStatementAs,
	"csvFields.amount": ValidationHelpers.positiveDollarAmount,
};

export default baseValidationsObject;

