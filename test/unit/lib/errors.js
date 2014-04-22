module('Balanced.ErrorsLogger');

test('.isExpectedError', function(assert) {
	var expectedErrors = [
		null,
		undefined, {
			errors: [{
				status_code: 400
			}]
		}
	];
	var unexpectedErrors = [{
		errors: [{
			status_code: 500
		}]
	}];

	_.each(expectedErrors, function(value) {
		assert.ok(Balanced.ErrorsLogger.isExpectedError(value));
	});

	_.each(unexpectedErrors, function(value) {
		assert.ok(!Balanced.ErrorsLogger.isExpectedError(value));
	});
});

test('.isExpectedStatusCode', function(assert) {
	var tests = {
		500: false,
		400: true,
		404: true,
		409: true,
		200: false
	};

	_.each(tests, function(value, key) {
		var statusCode = parseInt(key);
		assert.deepEqual(Balanced.ErrorsLogger.isExpectedStatusCode(statusCode), value);
	});
});
