import Transaction from "balanced-dashboard/models/transaction";

module('Transaction');

test(".findAppearsOnStatementAsInvalidCharacters", function(assert) {
	var tests = {
		"BALANCED, INC.": ",",
		"BALANCED-INC": "",
		"///,,,MMM": "/,"
	};

	_.each(tests, function(expected, value) {
		assert.equal(Transaction.findAppearsOnStatementAsInvalidCharacters(value), expected);
	});
});
