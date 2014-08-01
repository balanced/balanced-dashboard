module("Balanced.ResultsLoader", {
	teardown: function() {
		Testing.restoreMethods(
			Balanced.ModelArray.newArrayLoadedFromUri,
			Balanced.ModelArray.create
		);
	},
});

test("#setSortField", function(assert) {
	var subject = Balanced.ResultsLoader.create();
	var test = function(expectation) {
		assert.deepEqual(subject.get("sort"), expectation);
	};

	test("created_at,desc");
	subject.setSortField("created_at");
	test("created_at,asc");
	subject.setSortField("initiated_at");
	test("initiated_at,desc");
});

test("#resultsUri", function(assert) {
	var subject = Balanced.ResultsLoader.create({});

	var test = function(expectation) {
		assert.deepEqual(subject.get("resultsUri"), expectation);
	};

	test(undefined);
	subject.set("path", "/marketplaces");
	test("/marketplaces?limit=50&sort=created_at%2Cdesc");
});
