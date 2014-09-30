import Transaction from "balanced-dashboard/models/transaction";

module('Module - Transaction');

test(".findAppearsOnStatementAsInvalidCharacters", function() {
	var tests = {
		"BALANCED, INC.": ",",
		"BALANCED-INC": "",
		"///,,,MMM": "/,"
	};

	_.each(tests, function(expected, value) {
		equal(Transaction.findAppearsOnStatementAsInvalidCharacters(value), expected);
	});
});
