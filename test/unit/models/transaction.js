module('Balanced.Transaction');

test(".findAppearsOnStatementAsInvalidCharacters", function(assert) {
	var tests = {
		"BALANCED, INC.": ",",
		"BALANCED-INC": "",
		"///,,,MMM": "/,"
	};

	_.each(tests, function(expected, value) {
		assert.equal(Balanced.Transaction.findAppearsOnStatementAsInvalidCharacters(value), expected);
	});
});
