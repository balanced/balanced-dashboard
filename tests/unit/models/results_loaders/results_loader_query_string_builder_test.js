module("ResultsLoaderQueryStringBuilder");

test("#addValue", function(assert) {
	var testExpectation = function(key, value, result) {
		var builder = new ResultsLoaderQueryStringBuilder();
		builder.addValue(key, value);
		assert.deepEqual(builder.queryStringAttributes, result);
	};

	testExpectation("status", null, {});
	testExpectation("status", undefined, {});
	testExpectation("status", "", {});
	testExpectation("status", "all", {
		status: "all"
	});
	testExpectation("status", ["pending", "finished", "failed"], {
		"status[in]": "pending,finished,failed"
	});
	testExpectation("created_at[>]", moment("2000-10-10T07:00:00.000Z").toDate(), {
		"created_at[>]": "2000-10-10T07:00:00.000Z"
	});
	testExpectation("created_at[>]", moment("2000-10-10T07:00:00.000Z"), {
		"created_at[>]": "2000-10-10T07:00:00.000Z"
	});
});
